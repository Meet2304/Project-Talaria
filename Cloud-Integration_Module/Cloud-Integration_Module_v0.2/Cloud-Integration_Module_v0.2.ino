/**
 * @file Modified-Smart-Shoe-Firebase.ino
 * @brief ESP32-S3 firmware with advanced MPU6050/MAX30105 sensor fusion, per-batch step counting, and Firebase updates.
 * @author Meet Bhatt
 * @date 2025-10-11
 */

// ----------------------- Libraries -----------------------
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <Wire.h>
#include "MPU6050.h"
#include "MAX30105.h"
#include "spo2_algorithm.h" // Required for heart rate and SpO2 calculation

// ----------------------- CONFIG -----------------------
const char* WIFI_SSID = "WIFI_SSD";
const char* WIFI_PASS = "WIFI_PASSWORD";

const char* FIREBASE_API_KEY = "FIREBASE_API_KEY";
const char* FIREBASE_PROJECT_ID = "FIREBASE_PROJECT_ID";

// ----------------------- Derived -----------------------
String FIREBASE_DB_BASE;

// ----------------------- I2C & Sensors -----------------------
MPU6050 mpu(0x69); // Use I2C address 0x69 since AD0 pin is high
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
#define UPLOAD_INTERVAL_MS 20000UL // Increased to allow buffer to fill
#define SAMPLE_INTERVAL_MS 100UL
int batchCount = 0;
unsigned long lastUploadTime = 0;

// Buffers for Firebase batch upload
float ax_buf[BATCH_SIZE], ay_buf[BATCH_SIZE], az_buf[BATCH_SIZE];
float gx_buf[BATCH_SIZE], gy_buf[BATCH_SIZE], gz_buf[BATCH_SIZE];
float aroll_buf[BATCH_SIZE], apitch_buf[BATCH_SIZE];
float groll_buf[BATCH_SIZE], gpitch_buf[BATCH_SIZE], gyaw_buf[BATCH_SIZE];
float combroll_buf[BATCH_SIZE], combpitch_buf[BATCH_SIZE];
int32_t hr_buf[BATCH_SIZE], spo2_buf[BATCH_SIZE];
int8_t  hr_valid_buf[BATCH_SIZE], spo2_valid_buf[BATCH_SIZE];
uint32_t ir_buf[BATCH_SIZE], red_buf[BATCH_SIZE];
float temp_c_buf[BATCH_SIZE];


// ----------------------- MPU & Step Counting -----------------------
float accX_offset = 0, accY_offset = 0, accZ_offset = 0;
float gyroX_offset = 0, gyroY_offset = 0, gyroZ_offset = 0;
unsigned long mpu_lastTime;
float mpu_dt;
float accX, accY, accZ;
float gyroX, gyroY, gyroZ;
float accelRoll, accelPitch;
float gyroRoll = 0, gyroPitch = 0, gyroYaw = 0;
float combRoll = 0, combPitch = 0;
#define STEP_THRESHOLD 1.8  // Acceleration magnitude threshold for a step

// ----------------------- MAX30105 (for SpO2/HR) -----------------------
#define MAX_BUFFER_LENGTH 100 // Must be 100 for the spo2_algorithm
uint32_t irBuffer[MAX_BUFFER_LENGTH];
uint32_t redBuffer[MAX_BUFFER_LENGTH];
int max_buffer_idx = 0;

int32_t spo2 = 0;
int8_t validSPO2 = 0;
int32_t heartRate = 0;
int8_t validHeartRate = 0;
uint32_t irValue, redValue;
float temperature;

// ----------------------- Forward declarations -----------------------
bool connectWiFi();
bool doAnonymousSignup();
bool refreshIdToken();
bool ensureValidIdToken();
int countStepsInBatch();
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

  FIREBASE_DB_BASE = "https://project-talaria-1d870-default-rtdb.firebaseio.com";

  if (!connectWiFi()) {
    Serial.println("WiFi connect failed - halting.");
    while (1) delay(1000);
  }

  prefs.begin("talaria", false);
  refreshToken = prefs.getString("fb_refresh", "");
  localId = prefs.getString("fb_localid", "");
  Serial.println("Loaded saved refreshToken? " + String(refreshToken.length() > 0 ? "yes" : "no"));
  Serial.println("Loaded saved localId? " + String(localId.length() > 0 ? localId : "none"));

  if (!ensureValidIdToken()) {
    Serial.println("Failed to obtain idToken. Halting.");
    while (1) delay(1000);
  }

  Serial.println("Initializing MPU6050 (Gait Sensor)...");
  Wire.begin(MPU_SDA_PIN, MPU_SCL_PIN);
  mpu.initialize();
  mpu.setSleepEnabled(false);
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed! Check wiring.");
    while (1) delay(1000);
  }
  Serial.println("MPU6050 connected successfully!");
  calibrateMPU();

  // Initialize complementary filter with initial accelerometer readings
  updateMPUData();
  combRoll = accelRoll;
  combPitch = accelPitch;
  mpu_lastTime = millis(); // Reset timer after init read

  Serial.println("Initializing MAX30105 (SpO2/HR Sensor)...");
  I2C_MAX.begin(MAX_SDA_PIN, MAX_SCL_PIN);
  if (!particleSensor.begin(I2C_MAX, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 not found. Check wiring!");
    while (1) delay(1000);
  }
  Serial.println("MAX30105 connected successfully!");

  particleSensor.setup(60, 4, 2, 100, 411, 4096);

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
      if (uploadCurrentBatch()) {
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

  unsigned long currentTime = millis();
  mpu_dt = (currentTime - mpu_lastTime) / 1000.0;
  mpu_lastTime = currentTime;

  accelRoll  = atan2(accY, accZ) * 180.0 / PI;
  accelPitch = atan2(-accX, sqrt(accY * accY + accZ * accZ)) * 180.0 / PI;
  
  gyroRoll += gyroX * mpu_dt;
  gyroPitch += gyroY * mpu_dt;
  gyroYaw += gyroZ * mpu_dt;

  combRoll = 0.98 * (combRoll + gyroX * mpu_dt) + 0.02 * accelRoll;
  combPitch = 0.98 * (combPitch + gyroY * mpu_dt) + 0.02 * accelPitch;
}

void updateMAXData() {
  particleSensor.check();
  if (!particleSensor.available()) {
    return;
  }
  
  redValue = particleSensor.getRed();
  irValue = particleSensor.getIR();
  temperature = particleSensor.readTemperature();
  particleSensor.nextSample();

  redBuffer[max_buffer_idx] = redValue;
  irBuffer[max_buffer_idx] = irValue;
  max_buffer_idx++;

  if (max_buffer_idx >= MAX_BUFFER_LENGTH) {
    maxim_heart_rate_and_oxygen_saturation(irBuffer, MAX_BUFFER_LENGTH, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
    for (int i = 0; i < 75; i++) {
      redBuffer[i] = redBuffer[i + 25];
      irBuffer[i] = irBuffer[i + 25];
    }
    max_buffer_idx = 75;
  }
}

void calibrateMPU() {
  const int samples = 1000;
  long accX_sum = 0, accY_sum = 0, accZ_sum = 0;
  long gyroX_sum = 0, gyroY_sum = 0, gyroZ_sum = 0;
  Serial.println("Calibrating MPU6050 (do not move)...");
  for (int i = 0; i < samples; i++) {
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
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

// ----------------------- Buffer & Firebase -----------------------
void appendCurrentSampleToBuffer() {
  if (batchCount >= BATCH_SIZE) return;

  ax_buf[batchCount] = accX; ay_buf[batchCount] = accY; az_buf[batchCount] = accZ;
  gx_buf[batchCount] = gyroX; gy_buf[batchCount] = gyroY; gz_buf[batchCount] = gyroZ;
  aroll_buf[batchCount] = accelRoll; apitch_buf[batchCount] = accelPitch;
  groll_buf[batchCount] = gyroRoll; gpitch_buf[batchCount] = gyroPitch; gyaw_buf[batchCount] = gyroYaw;
  combroll_buf[batchCount] = combRoll; combpitch_buf[batchCount] = combPitch;
  
  // Only store valid HR/SpO2 readings. Store 0 if invalid to avoid sending -999.
  if (validHeartRate == 1) {
    hr_buf[batchCount] = heartRate;
  } else {
    hr_buf[batchCount] = 0;
  }
  hr_valid_buf[batchCount] = validHeartRate;

  if (validSPO2 == 1) {
    spo2_buf[batchCount] = spo2;
  } else {
    spo2_buf[batchCount] = 0;
  }
  spo2_valid_buf[batchCount] = validSPO2;
  
  ir_buf[batchCount] = irValue; red_buf[batchCount] = redValue;
  temp_c_buf[batchCount] = temperature;

  batchCount++;
}

/**
 * @brief Analyzes the accelerometer data in the current batch to count footsteps.
 * @return The number of steps detected in the batch.
 */
int countStepsInBatch() {
  int steps = 0;
  int lastStepIndex = -100; // Used for debouncing, initialized to a safe value
  // Debounce: 250ms / 100ms sample interval = 2.5. Round up to 3 samples.
  const int STEP_DEBOUNCE_SAMPLES = 3; 

  for (int i = 0; i < batchCount; i++) {
    // Calculate the magnitude of the acceleration vector for the current sample
    float accMagnitude = sqrt(ax_buf[i]*ax_buf[i] + ay_buf[i]*ay_buf[i] + az_buf[i]*az_buf[i]);
    
    // Check if magnitude crosses the threshold and if enough time (samples) has passed since the last step
    if (accMagnitude > STEP_THRESHOLD && (i - lastStepIndex) > STEP_DEBOUNCE_SAMPLES) {
      steps++;
      lastStepIndex = i; // Record the index of this step
    }
  }
  return steps;
}

bool uploadCurrentBatch() {
  if (!ensureValidIdToken()) return false;

  // Analyze the buffered data to get the step count for this specific batch
  int stepsInThisBatch = countStepsInBatch();
  Serial.printf("Batch ready. Steps in this batch: %d\n", stepsInThisBatch);

  DynamicJsonDocument doc(32768);
  doc["device_id"] = localId.length() ? localId : "esp32-unknown";
  doc["n"] = batchCount;
  doc["client_ts_ms"] = millis();
  doc["sample_rate_ms"] = SAMPLE_INTERVAL_MS;
  doc["steps_in_batch"] = stepsInThisBatch; // Add the new per-batch step count
  JsonObject ts = doc.createNestedObject("ts"); ts[".sv"] = "timestamp";

  JsonArray ax = doc.createNestedArray("accX"); JsonArray ay = doc.createNestedArray("accY"); JsonArray az = doc.createNestedArray("accZ");
  JsonArray gx = doc.createNestedArray("gyroX"); JsonArray gy = doc.createNestedArray("gyroY"); JsonArray gz = doc.createNestedArray("gyroZ");
  JsonArray ar = doc.createNestedArray("aroll"); JsonArray ap = doc.createNestedArray("apitch");
  JsonArray gr = doc.createNestedArray("groll"); JsonArray gp = doc.createNestedArray("gpitch"); JsonArray gyaw = doc.createNestedArray("gyaw");
  JsonArray cr = doc.createNestedArray("combroll"); JsonArray cp = doc.createNestedArray("combpitch");
  JsonArray hr = doc.createNestedArray("hr"); JsonArray hr_valid = doc.createNestedArray("hr_valid");
  JsonArray spo2_arr = doc.createNestedArray("spo2"); JsonArray spo2_valid = doc.createNestedArray("spo2_valid");
  JsonArray ir = doc.createNestedArray("ir"); JsonArray red = doc.createNestedArray("red");
  JsonArray temp = doc.createNestedArray("temp_c");

  for (int i = 0; i < batchCount; i++) {
    ax.add(ax_buf[i]); ay.add(ay_buf[i]); az.add(az_buf[i]);
    gx.add(gx_buf[i]); gy.add(gy_buf[i]); gz.add(gz_buf[i]);
    ar.add(aroll_buf[i]); ap.add(apitch_buf[i]);
    gr.add(groll_buf[i]); gp.add(gpitch_buf[i]); gyaw.add(gyaw_buf[i]);
    cr.add(combroll_buf[i]); cp.add(combpitch_buf[i]);
    hr.add(hr_buf[i]); hr_valid.add(hr_valid_buf[i]);
    spo2_arr.add(spo2_buf[i]); spo2_valid.add(spo2_valid_buf[i]);
    ir.add(ir_buf[i]); red.add(red_buf[i]);
    temp.add(temp_c_buf[i]);
  }

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  String url = FIREBASE_DB_BASE + "/devices/" + (localId.length() ? localId : "esp32-unknown") + "/readings.json?auth=" + idToken;

  WiFiClientSecure client; client.setInsecure();
  HTTPClient https; https.begin(client, url);
  https.addHeader("Content-Type", "application/json");
  int httpCode = https.POST(jsonPayload);
  String resp = https.getString(); https.end();

  Serial.printf("Upload HTTP code=%d\nResponse: %s\n", httpCode, resp.c_str());
  return (httpCode == 200 || httpCode == 204);
}

void clearBuffer() {
  batchCount = 0;
}

// ----------------------- WiFi & Auth -----------------------
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
    if (deserializeJson(doc, resp) == DeserializationError::Ok) {
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
    if (deserializeJson(doc, resp) == DeserializationError::Ok) {
      idToken = doc["id_token"].as<String>();
      refreshToken = doc["refresh_token"].as<String>();
      tokenExpiryMs = millis() + doc["expires_in"].as<long>() * 1000UL;
      prefs.putString("fb_refresh", refreshToken);
      return true;
    }
  }
  return false;
}

// ----------------------- Utility -----------------------
void printCombinedData() {
  Serial.printf("MPU -> C.Roll: %.1f C.Pitch: %.1f || MAX -> HR: %ld(V:%d) SpO2: %ld(V:%d) || Buffer: %d/%d\n",
                combRoll, combPitch,
                heartRate, validHeartRate, spo2, validSPO2,
                batchCount, BATCH_SIZE);
}

