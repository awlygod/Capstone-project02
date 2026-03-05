# SAR Mini Rover: Ground Station Dashboard

A compact IoT-enabled Search and Rescue (SAR) rover designed for deployment through narrow conduits in collapsed structures. This repo contains the **React-based ground station dashboard** for real-time telemetry monitoring and video-based human detection.

---

## Features

- **Live video feed** from ESP32-CAM with YOLOv8 human detection overlay
- **Environmental telemetry** — temperature, humidity, O₂, CO gas, dust (PM2.5)
- **Detection modules** — PIR motion, mmWave radar, voice keyword (via Raspberry Pi Pico + INMP441)
- **Obstacle radar** — ultrasonic sensor with servo sweep visualized as a radar display
- **Battery/BMS monitoring** — voltage, current, estimated runtime
- **Event log** — real-time alerts for gas spikes, human detection, and voice triggers
- **Rover controls** — directional movement, lights, fan, emergency stop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Dashboard UI | React (JSX) |
| Human Detection | Python + YOLOv8 (Ultralytics) + OpenCV |
| Backend / Data Bridge | Python + FastAPI + WebSocket |
| Rover Firmware | ESP32-S3 (motor control, sensors, telemetry) |
| Voice Detection | Raspberry Pi Pico + INMP441 mic + keyword model |
| Video Stream | ESP32-CAM over WiFi (WebSocket) |
| Ground Control | Arduino + nRF transceiver + joystick |

---

## Project Structure

```
sar-rover/
├── dashboard/          # React frontend (this repo)
│   └── SARDashboard.jsx
├── backend/            # Python WebSocket server + YOLO inference (coming soon)
├── firmware/           # ESP32-S3 Arduino/MicroPython code (coming soon)
└── pico/               # Raspberry Pi Pico voice detection code (coming soon)
```

---

## Getting Started

### Dashboard (React)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

> Currently runs with **simulated data**. Connect to real ESP32 by replacing the WebSocket URL in the data hooks with your rover's IP address.

### Connecting to ESP32

Update the stream URL in the dashboard:
```
ws://192.168.x.x:81/stream   ← ESP32-CAM video
ws://192.168.x.x:82/telemetry ← Sensor data (WebSocket)
```

---

## Hardware Components

- ESP32-S3 (main controller)
- ESP32-CAM (video feed)
- Raspberry Pi Pico (voice detection)
- MQ-series + O₂ gas sensors
- DHT22 (temp/humidity), GP2Y dust sensor
- HC-SR04 ultrasonic + servo (obstacle radar)
- PIR / mmWave / IR (human detection)
- LiPo battery pack + BMS
- 2WD DC motors + castor wheel

---
Team
Built as part of a Search and Rescue robotics project.

---

## Team

Built as part of a Search and Rescue robotics project.
