#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"  // Needed for checkForBeat()

MAX30105 particleSensor;
TwoWire myWire = TwoWire(0);  // Use I2C port 0

#define SDA_PIN 9
#define SCL_PIN 8

const byte RATE_SIZE = 4;        // Number of samples to average
byte rates[RATE_SIZE];            // Array of heart rates
byte rateSpot = 0;
long lastBeat = 0;                // Timestamp of last beat
float beatsPerMinute = 0;
int beatAvg = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Initializing MAX30102...");

  // Initialize custom I2C bus
  myWire.begin(SDA_PIN, SCL_PIN);

  // Initialize sensor
  if (!particleSensor.begin(myWire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found. Check wiring!");
    while (1);
  }

  Serial.println("Place your finger on the sensor with steady pressure.");

  particleSensor.setup();                    // Default sensor settings
  particleSensor.setPulseAmplitudeRed(0x0A); // Low Red LED to indicate running
  particleSensor.setPulseAmplitudeGreen(0);  // Turn off Green LED

  // Initialize rates array with default value
  for (byte i = 0; i < RATE_SIZE; i++) rates[i] = 70;
}

void loop() {
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue)) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60.0 / (delta / 1000.0);

    // Only consider realistic BPM values
    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE; // Wrap index

      // Calculate average BPM
      beatAvg = 0;
      for (byte x = 0; x < RATE_SIZE; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }

  // Print sensor readings
  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute, 1);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);

  if (irValue < 50000) Serial.print(" No finger?");

  Serial.println();

  delay(100); // Small delay for serial output
}
