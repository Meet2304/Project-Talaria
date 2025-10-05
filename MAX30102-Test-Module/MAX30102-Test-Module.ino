#include <Wire.h>
#include "MAX30105.h"

MAX30105 particleSensor;
TwoWire myWire = TwoWire(0);  // Use I2C port 0

#define SDA_PIN 9
#define SCL_PIN 8

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Initializing MAX30102...");

  myWire.begin(SDA_PIN, SCL_PIN);
  
  if (!particleSensor.begin(myWire, I2C_SPEED_STANDARD)) {
    Serial.println("MAX30102 not found. Check wiring!");
    while (1);
  }

  Serial.println("MAX30102 found!");
  
  particleSensor.setup(60, 4, 2, 100, 411, 4096);
  Serial.println("Sensor initialized. Begin reading...");
}

void loop() {
  long irValue = particleSensor.getIR();
  long redValue = particleSensor.getRed();

  Serial.print("IR: ");
  Serial.print(irValue);
  Serial.print("  RED: ");
  Serial.println(redValue);

  delay(500);
}
