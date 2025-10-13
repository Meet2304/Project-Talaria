/**
 * @file Integrated-Smart-Shoe-Firebase-Verbose.ino
 * @brief ESP32-S3 firmware with proper MPU6050 calibration and Firebase updates
 * @author Meet Bhatt
 * @date 2025-10-06
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <Wire.h>
#include "MPU6050.h"
#include "MAX30105.h"
#include "heartRate.h"

// ----------------------- CONFIG -----------------------
const char* WIFI_SSID = "WIFI_SSD";
const char* WIFI_PASS = "WIFI_PASSWORD";

const char* FIREBASE_API_KEY = "FIREBASE_API_KEY";
const char* FIREBASE_PROJECT_ID = "FIREBASE_PROJET_ID";

// ----------------------- Derived -----------------------
String FIREBASE_DB_BASE;

// ----------------------- I2C & Sensors -----------------------
MPU6050 mpu;
#define MPU_SDA_PIN 5
#define MPU_SCL_PIN 6

MAX30105 particleSensor;
#define MAX_SDA_PIN 9
#define MAX_SCL_PIN 8
TwoWire I2C_MAX = TwoWire(1);

// ----------------------- Persistent storage -----------------------
Preferences prefs;
String idToken = "";
String refreshToken = "";
String localId = "";
unsigned long tokenExpiryMs = 0;

// ----------------------- Buffer settings -----------------------
#define BATCH_SIZE 50
#define UPLOAD_INTERVAL_MS 10000UL
#define SAMPLE_INTERVAL_MS 100UL
int batchCount = 0;
unsigned long lastUploadTime = 0;

float ax_buf[BATCH_SIZE], ay_buf[BATCH_SIZE], az_buf[BATCH_SIZE];
float gx_buf[BATCH_SIZE], gy_buf[BATCH_SIZE], gz_buf[BATCH_SIZE];
float bpm_buf[BATCH_SIZE];
long ir_buf[BATCH_SIZE];

// ----------------------- MPU -----------------------
float accX_offset = 0, accY_offset = 0, accZ_offset = 0;
float gyroX_offset = 0, gyroY_offset = 0, gyroZ_offset = 0;
unsigned long mpu_lastTime;
float mpu_dt;
float accX, accY, accZ;
float gyroX, gyroY, gyroZ;
float roll, pitch, yaw = 0;

// ----------------------- MAX30102 -----------------------
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute = 0;
int beatAvg = 0;
long irValue;

// ----------------------- Forward declarations -----------------------
bool connectWiFi();
bool doAnonymousSignup();
bool refreshIdToken();
bool ensureValidIdToken();
bool uploadCurrentBatch();
void appendCurrentSampleToBuffer();
void clearBuffer();
void calibrateMPU();
void updateMPUData();
void updateMAXData();
void printCombinedData();

// ----------------------- SETUP -----------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- Integrated Footwear System Initializing ---");

  // Firebase DB base
  FIREBASE_DB_BASE = "https://project-talaria-1d870-default-rtdb.firebaseio.com";

  // ----- WiFi -----
  if (!connectWiFi()) {
    Serial.println("WiFi connect failed - halting.");
    while (1) delay(1000);
  }

  // ----- Persistent prefs -----
  prefs.begin("talaria", false);
  refreshToken = prefs.getString("fb_refresh", "");
  localId = prefs.getString("fb_localid", "");
  Serial.println("Loaded saved refreshToken? " + String(refreshToken.length() > 0 ? "yes" : "no"));
  Serial.println("Loaded saved localId? " + String(localId.length() > 0 ? localId : "none"));

  // ----- Firebase auth -----
  Serial.println("Ensuring valid Firebase idToken...");
  if (!ensureValidIdToken()) {
    Serial.println("Failed to obtain idToken. Halting.");
    while (1) delay(1000);
  }

  // ----- Initialize MPU6050 -----
  Serial.println("Initializing MPU6050 (Gait Sensor)...");
  Wire.begin(MPU_SDA_PIN, MPU_SCL_PIN);
  mpu.initialize();
  mpu.setSleepEnabled(false);
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed! Check wiring.");
    while (1) delay(1000);
  }
  Serial.println("MPU6050 connected successfully!");

  // ----- Calibrate MPU BEFORE any readings -----
  calibrateMPU();
  mpu_lastTime = millis();
  yaw = 0; // Reset yaw after calibration

  // ----- Initialize MAX30102 -----
  Serial.println("Initializing MAX30102 (Heart Rate Sensor)...");
  I2C_MAX.begin(MAX_SDA_PIN, MAX_SCL_PIN);
  if (!particleSensor.begin(I2C_MAX, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found. Check wiring!");
    while (1) delay(1000);
  }
  Serial.println("MAX30102 connected successfully!");
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
  for (byte i = 0; i < RATE_SIZE; i++) rates[i] = 70;

  Serial.println("\n--- Initialization Complete ---");
  lastUploadTime = millis();
}

// ----------------------- LOOP -----------------------
void loop() {
  updateMPUData();
  updateMAXData();
  appendCurrentSampleToBuffer();

  unsigned long now = millis();
  if (batchCount >= BATCH_SIZE || (now - lastUploadTime) >= UPLOAD_INTERVAL_MS) {
    if (batchCount > 0) {
      Serial.println("\n--- Uploading batch to Firebase ---");
      bool ok = uploadCurrentBatch();
      if (ok) {
        Serial.println("--- Batch upload successful ---");
        clearBuffer();
        lastUploadTime = now;
      } else {
        Serial.println("Upload failed - will retry later (buffer retained).");
      }
    } else {
      lastUploadTime = now;
    }
  }

  printCombinedData();
  delay(SAMPLE_INTERVAL_MS);
}

// ----------------------- WiFi -----------------------
bool connectWiFi() {
  Serial.printf("Connecting WiFi to %s\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && (millis() - t0) < 20000UL) {
    delay(250);
    Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected.");
    Serial.print("IP: "); Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("\nWiFi connect timed out.");
    return false;
  }
}

// ----------------------- Firebase Auth -----------------------
bool ensureValidIdToken() {
  if (idToken.length() > 0 && millis() < tokenExpiryMs - 30000UL) return true;
  if (refreshToken.length() > 0) {
    if (refreshIdToken()) return true;
  }
  return doAnonymousSignup();
}

bool doAnonymousSignup() {
  String url = String("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=") + FIREBASE_API_KEY;
  WiFiClientSecure client; client.setInsecure();
  HTTPClient https; https.begin(client, url);
  https.addHeader("Content-Type", "application/json");
  int httpCode = https.POST("{\"returnSecureToken\":true}");
  String resp = https.getString(); https.end();
  if (httpCode == 200) {
    DynamicJsonDocument doc(4096);
    if (!deserializeJson(doc, resp)) {
      idToken = doc["idToken"].as<String>();
      refreshToken = doc["refreshToken"].as<String>();
      localId = doc["localId"].as<String>();
      tokenExpiryMs = millis() + doc["expiresIn"].as<long>() * 1000UL;
      prefs.putString("fb_refresh", refreshToken);
      prefs.putString("fb_localid", localId);
      return true;
    }
  }
  return false;
}

bool refreshIdToken() {
  String url = String("https://securetoken.googleapis.com/v1/token?key=") + FIREBASE_API_KEY;
  WiFiClientSecure client; client.setInsecure();
  HTTPClient https; https.begin(client, url);
  https.addHeader("Content-Type", "application/x-www-form-urlencoded");
  String body = "grant_type=refresh_token&refresh_token=" + refreshToken;
  int httpCode = https.POST(body);
  String resp = https.getString(); https.end();
  if (httpCode == 200) {
    DynamicJsonDocument doc(4096);
    if (!deserializeJson(doc, resp)) {
      idToken = doc["id_token"].as<String>();
      refreshToken = doc["refresh_token"].as<String>();
      tokenExpiryMs = millis() + doc["expires_in"].as<long>() * 1000UL;
      prefs.putString("fb_refresh", refreshToken);
      return true;
    }
  }
  return false;
}

// ----------------------- Buffer -----------------------
void appendCurrentSampleToBuffer() {
  if (batchCount >= BATCH_SIZE) return;
  ax_buf[batchCount] = accX; ay_buf[batchCount] = accY; az_buf[batchCount] = accZ;
  gx_buf[batchCount] = gyroX; gy_buf[batchCount] = gyroY; gz_buf[batchCount] = gyroZ;
  bpm_buf[batchCount] = beatsPerMinute; ir_buf[batchCount] = irValue;
  batchCount++;
}

bool uploadCurrentBatch() {
  if (!ensureValidIdToken()) return false;

  DynamicJsonDocument doc(32768);
  doc["device_id"] = localId.length() ? localId : "esp32-unknown";
  doc["n"] = batchCount;
  doc["client_ts_ms"] = millis();
  doc["sample_rate_ms"] = SAMPLE_INTERVAL_MS;
  JsonObject ts = doc.createNestedObject("ts"); ts[".sv"] = "timestamp";

  JsonArray ax = doc.createNestedArray("ax");
  JsonArray ay = doc.createNestedArray("ay");
  JsonArray az = doc.createNestedArray("az");
  JsonArray gx = doc.createNestedArray("gx");
  JsonArray gy = doc.createNestedArray("gy");
  JsonArray gz = doc.createNestedArray("gz");
  JsonArray bpm = doc.createNestedArray("bpm");
  JsonArray irArr = doc.createNestedArray("ir");

  for (int i = 0; i < batchCount; i++) {
    ax.add(ax_buf[i]); ay.add(ay_buf[i]); az.add(az_buf[i]);
    gx.add(gx_buf[i]); gy.add(gy_buf[i]); gz.add(gz_buf[i]);
    bpm.add(bpm_buf[i]); irArr.add(ir_buf[i]);
  }

  String jsonPayload; serializeJson(doc, jsonPayload);
  String url = FIREBASE_DB_BASE + "/devices/" + (localId.length() ? localId : "esp32-unknown") + "/readings.json?auth=" + idToken;

  WiFiClientSecure client; client.setInsecure();
  HTTPClient https; https.begin(client, url);
  https.addHeader("Content-Type", "application/json");
  int httpCode = https.POST(jsonPayload);
  String resp = https.getString(); https.end();

  Serial.printf("Upload HTTP code=%d\nResponse: %s\n", httpCode, resp.c_str());
  return (httpCode == 200 || httpCode == 204);
}

void clearBuffer() { batchCount = 0; }

// ----------------------- Sensor Updates -----------------------
void updateMPUData() {
  int16_t ax_raw, ay_raw, az_raw, gx_raw, gy_raw, gz_raw;
  mpu.getMotion6(&ax_raw, &ay_raw, &az_raw, &gx_raw, &gy_raw, &gz_raw);

  accX = (ax_raw - accX_offset) / 16384.0;
  accY = (ay_raw - accY_offset) / 16384.0;
  accZ = (az_raw - accZ_offset) / 16384.0;
  gyroX = (gx_raw - gyroX_offset) / 131.0;
  gyroY = (gy_raw - gyroY_offset) / 131.0;
  gyroZ = (gz_raw - gyroZ_offset) / 131.0;

  roll  = atan2(accY, accZ) * 180.0 / PI;
  pitch = atan2(-accX, sqrt(accY*accY + accZ*accZ)) * 180.0 / PI;

  unsigned long currentTime = millis();
  mpu_dt = (currentTime - mpu_lastTime) / 1000.0;
  mpu_lastTime = currentTime;
  yaw += gyroZ * mpu_dt;
}

void updateMAXData() {
  irValue = particleSensor.getIR();
  if (checkForBeat(irValue)) {
    long delta = millis() - lastBeat;
    lastBeat = millis();
    float instantBPM = 60.0 / (delta / 1000.0);
    if (instantBPM < 255 && instantBPM > 20) {
      rates[rateSpot++] = (byte)instantBPM;
      rateSpot %= RATE_SIZE;
      beatAvg = 0;
      for (byte i = 0; i < RATE_SIZE; i++) beatAvg += rates[i];
      beatAvg /= RATE_SIZE;
      beatsPerMinute = beatAvg;
    }
  }
}

void printCombinedData() {
  Serial.printf("MPU -> Roll: %.1f Pitch: %.1f Yaw: %.1f || MAX -> IR: %ld BPM: %.1f AvgBPM: %d || buffer: %d\n",
                roll, pitch, yaw, irValue, beatsPerMinute, beatAvg, batchCount);
}

void calibrateMPU() {
  const int samples = 1000;
  long accX_sum=0, accY_sum=0, accZ_sum=0;
  long gyroX_sum=0, gyroY_sum=0, gyroZ_sum=0;
  Serial.println("Calibrating MPU6050...");
  for (int i=0;i<samples;i++){
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax,&ay,&az,&gx,&gy,&gz);
    accX_sum += ax; accY_sum += ay; accZ_sum += az;
    gyroX_sum += gx; gyroY_sum += gy; gyroZ_sum += gz;
    delay(2);
  }
  accX_offset = accX_sum / (float)samples;
  accY_offset = accY_sum / (float)samples;
  accZ_offset = accZ_sum / (float)samples - 16384.0;
  gyroX_offset = gyroX_sum / (float)samples;
  gyroY_offset = gyroY_sum / (float)samples;
  gyroZ_offset = gyroZ_sum / (float)samples;
  Serial.println("MPU calibration complete!");
}
