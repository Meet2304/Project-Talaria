#include <Wire.h>
#include "MPU6050.h"

MPU6050 mpu;

#define SDA_PIN 5
#define SCL_PIN 6

// Calibration offsets
float accX_offset = 0;
float accY_offset = 0;
float accZ_offset = 0;
float gyroX_offset = 0;
float gyroY_offset = 0;
float gyroZ_offset = 0;

// Timer for integration
unsigned long lastTime;
float dt;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Initializing MPU6050...");

  Wire.begin(SDA_PIN, SCL_PIN);

  mpu.initialize();
  mpu.setSleepEnabled(false);

  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed!");
    while (1);
  }
  Serial.println("MPU6050 connected successfully!");

  // Improved calibration
  calibrateSensor();

  lastTime = millis();
}

void loop() {
  int16_t ax, ay, az;
  int16_t gx, gy, gz;

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  float accX = (ax - accX_offset) / 16384.0;
  float accY = (ay - accY_offset) / 16384.0;
  float accZ = (az - accZ_offset) / 16384.0;

  float gyroX = (gx - gyroX_offset) / 131.0;
  float gyroY = (gy - gyroY_offset) / 131.0;
  float gyroZ = (gz - gyroZ_offset) / 131.0;

  float roll  = atan2(accY, accZ) * 180.0 / PI;
  float pitch = atan2(-accX, sqrt(accY*accY + accZ*accZ)) * 180.0 / PI;

  unsigned long currentTime = millis();
  dt = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;
  static float yaw = 0;
  yaw += gyroZ * dt;

  Serial.print("Acc(g): X="); Serial.print(accX, 2);
  Serial.print(" Y="); Serial.print(accY, 2);
  Serial.print(" Z="); Serial.print(accZ, 2);

  Serial.print(" | Gyro(deg/s): X="); Serial.print(gyroX, 2);
  Serial.print(" Y="); Serial.print(gyroY, 2);
  Serial.print(" Z="); Serial.print(gyroZ, 2);

  Serial.print(" | Orientation(deg): Roll="); Serial.print(roll, 2);
  Serial.print(" Pitch="); Serial.print(pitch, 2);
  Serial.print(" Yaw="); Serial.println(yaw, 2);

  delay(100);
}

void calibrateSensor() {
  const int samples = 2000;
  long accX_sum = 0, accY_sum = 0, accZ_sum = 0;
  long gyroX_sum = 0, gyroY_sum = 0, gyroZ_sum = 0;

  Serial.println("Calibrating MPU6050, keep sensor perfectly stationary...");

  for (int i = 0; i < samples; i++) {
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

    accX_sum += ax;
    accY_sum += ay;
    accZ_sum += az;

    gyroX_sum += gx;
    gyroY_sum += gy;
    gyroZ_sum += gz;

    if (i % 500 == 0) { // Print every 500 samples
      Serial.print("Sample "); Serial.print(i);
      Serial.print(": Acc raw = "); Serial.print(ax); Serial.print(", "); Serial.print(ay); Serial.print(", "); Serial.print(az);
      Serial.print(" | Gyro raw = "); Serial.print(gx); Serial.print(", "); Serial.print(gy); Serial.print(", "); Serial.println(gz);
    }

    delay(2);
  }

  accX_offset = accX_sum / (float)samples;
  accY_offset = accY_sum / (float)samples;
  accZ_offset = accZ_sum / (float)samples - 16384; // Remove gravity for stationary Z

  gyroX_offset = gyroX_sum / (float)samples;
  gyroY_offset = gyroY_sum / (float)samples;
  gyroZ_offset = gyroZ_sum / (float)samples;

  Serial.println("Calibration complete!");
  Serial.print("Offsets -> Acc: X="); Serial.print(accX_offset); Serial.print(" Y="); Serial.print(accY_offset); Serial.print(" Z="); Serial.println(accZ_offset);
  Serial.print("Offsets -> Gyro: X="); Serial.print(gyroX_offset); Serial.print(" Y="); Serial.print(gyroY_offset); Serial.print(" Z="); Serial.println(gyroZ_offset);
}
