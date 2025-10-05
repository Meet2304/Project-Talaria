/**
 * @file Integrated-Smart-Shoe.ino
 * @brief Comprehensive firmware for an ESP32-S3 based smart shoe.
 * @details This code integrates an MPU6050 for gait analysis (accelerometer & gyroscope)
 * and a MAX30102 for cardiovascular monitoring (heart rate).
 * It uses two separate I2C buses on the ESP32 to ensure stable communication
 * with both sensors concurrently.
 *
 * @author Meet Bhatt
 * @date 2025-10-05
 */

//==================================================================================
//  1. LIBRARIES
//==================================================================================
#include <Wire.h>
#include "MPU6050.h"      // For MPU6050 sensor
#include "MAX30105.h"    // For MAX30102 sensor
#include "heartRate.h"   // For MAX30102 heart rate algorithm

//==================================================================================
//  2. SENSOR CONFIGURATION & OBJECTS
//==================================================================================

// --- MPU6050 (Gait Analysis) Configuration ---
MPU6050 mpu;
#define MPU_SDA_PIN 5
#define MPU_SCL_PIN 6
// Note: MPU6050 will use the default I2C bus (Wire)

// --- MAX30102 (Cardiovascular) Configuration ---
MAX30105 particleSensor;
#define MAX_SDA_PIN 9
#define MAX_SCL_PIN 8
TwoWire I2C_MAX = TwoWire(1); // Use the second I2C bus (Wire1) for the MAX30102

//==================================================================================
//  3. GLOBAL VARIABLES
//==================================================================================

// --- MPU6050 Variables ---
float accX_offset = 0, accY_offset = 0, accZ_offset = 0;
float gyroX_offset = 0, gyroY_offset = 0, gyroZ_offset = 0;
unsigned long mpu_lastTime;
float mpu_dt;
float accX, accY, accZ;
float gyroX, gyroY, gyroZ;
float roll, pitch, yaw = 0;

// --- MAX30102 Variables ---
const byte RATE_SIZE = 4; // Number of heart rate samples to average
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute = 0;
int beatAvg = 0;
long irValue;

//==================================================================================
//  4. SETUP FUNCTION
//==================================================================================
void setup() {
  Serial.begin(115200);
  delay(1000); // Wait for serial monitor to open
  Serial.println("--- Integrated Footwear System Initializing ---");

  // --- Initialize MPU6050 ---
  Serial.println("Initializing MPU6050 (Gait Sensor)...");
  Wire.begin(MPU_SDA_PIN, MPU_SCL_PIN); // Initialize I2C bus 0
  mpu.initialize();
  mpu.setSleepEnabled(false);
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed! Check wiring.");
    while (1);
  }
  Serial.println("MPU6050 connected successfully!");
  calibrateMPU(); // Calibrate sensor on startup
  mpu_lastTime = millis();

  // --- Initialize MAX30102 ---
  Serial.println("\nInitializing MAX30102 (Heart Rate Sensor)...");
  I2C_MAX.begin(MAX_SDA_PIN, MAX_SCL_PIN); // Initialize I2C bus 1
  if (!particleSensor.begin(I2C_MAX, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found. Check wiring!");
    while (1);
  }
  Serial.println("MAX30102 connected successfully!");
  Serial.println("Place your finger on the sensor with steady pressure.");
  
  particleSensor.setup(); // Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); // Low Red LED to indicate it's running
  particleSensor.setPulseAmplitudeGreen(0);  // Turn off Green LED
  for (byte i = 0; i < RATE_SIZE; i++) rates[i] = 70; // Initialize rates array

  Serial.println("\n--- Initialization Complete. Starting measurements. ---");
}

//==================================================================================
//  5. MAIN LOOP
//==================================================================================
void loop() {
  updateMPUData();
  updateMAXData();
  printCombinedData();
  delay(100); // Common delay for the loop
}

//==================================================================================
//  6. SENSOR-SPECIFIC FUNCTIONS
//==================================================================================

/**
 * @brief Reads and processes the latest data from the MPU6050.
 */
void updateMPUData() {
  int16_t ax_raw, ay_raw, az_raw;
  int16_t gx_raw, gy_raw, gz_raw;
  
  mpu.getMotion6(&ax_raw, &ay_raw, &az_raw, &gx_raw, &gy_raw, &gz_raw);

  // Apply calibration offsets and scale factors
  accX = (ax_raw - accX_offset) / 16384.0;
  accY = (ay_raw - accY_offset) / 16384.0;
  accZ = (az_raw - accZ_offset) / 16384.0;
  gyroX = (gx_raw - gyroX_offset) / 131.0;
  gyroY = (gy_raw - gyroY_offset) / 131.0;
  gyroZ = (gz_raw - gyroZ_offset) / 131.0;
  
  // Calculate orientation
  roll  = atan2(accY, accZ) * 180.0 / PI;
  pitch = atan2(-accX, sqrt(accY * accY + accZ * accZ)) * 180.0 / PI;

  // Integrate yaw from gyroscope
  unsigned long currentTime = millis();
  mpu_dt = (currentTime - mpu_lastTime) / 1000.0;
  mpu_lastTime = currentTime;
  yaw += gyroZ * mpu_dt;
}

/**
 * @brief Reads and processes the latest data from the MAX30102.
 */
void updateMAXData() {
  irValue = particleSensor.getIR();

  if (checkForBeat(irValue)) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60.0 / (delta / 1000.0);

    // Store measurement in array if it's a realistic BPM
    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE; // Wrap the index

      // Calculate the average
      beatAvg = 0;
      for (byte x = 0; x < RATE_SIZE; x++) {
        beatAvg += rates[x];
      }
      beatAvg /= RATE_SIZE;
    }
  }
}

/**
 * @brief Prints the combined sensor data to the Serial Monitor.
 */
void printCombinedData() {
  // Gait Data
  Serial.print("Roll: "); Serial.print(roll, 1);
  Serial.print(" | Pitch: "); Serial.print(pitch, 1);
  Serial.print(" | Yaw: "); Serial.print(yaw, 1);
  
  // Cardiovascular Data
  Serial.print(" || IR: "); Serial.print(irValue);
  Serial.print(" | BPM: "); Serial.print(beatsPerMinute, 1);
  Serial.print(" | Avg BPM: "); Serial.print(beatAvg);

  if (irValue < 50000) {
    Serial.print(" (No finger?)");
  }

  Serial.println();
}

/**
 * @brief Calibrates the MPU6050 by averaging readings while stationary.
 */
void calibrateMPU() {
  const int samples = 2000;
  long accX_sum = 0, accY_sum = 0, accZ_sum = 0;
  long gyroX_sum = 0, gyroY_sum = 0, gyroZ_sum = 0;

  Serial.println("Calibrating MPU6050, keep the sensor perfectly stationary...");
  
  for (int i = 0; i < samples; i++) {
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
    accX_sum += ax;
    accY_sum += ay;
    accZ_sum += az;
    gyroX_sum += gx;
    gyroY_sum += gy;
    gyroZ_sum += gz;
    delay(2);
  }

  // Calculate average offsets
  accX_offset = accX_sum / (float)samples;
  accY_offset = accY_sum / (float)samples;
  accZ_offset = accZ_sum / (float)samples - 16384; // Subtract gravity (1g) from Z-axis
  
  gyroX_offset = gyroX_sum / (float)samples;
  gyroY_offset = gyroY_sum / (float)samples;
  gyroZ_offset = gyroZ_sum / (float)samples;

  Serial.println("Calibration complete!");
}