# Talaria - Cardiovascular & Gait Analysis Web Application

A modern web application for concurrent cardiovascular and gait analysis. Talaria provides real-time monitoring and analytics for data collected from MPU6050 (accelerometer/gyroscope) and MAX30102 (heart rate/SpO2) sensors.

## 🚀 Features

- **Real-time Heart Rate Monitoring** - Track cardiovascular health with MAX30102 sensor
- **Blood Oxygen Saturation (SpO2)** - Continuous oxygen level tracking
- **Gait Analysis** - Precise movement tracking using MPU6050 accelerometer
- **Live Analytics** - Real-time data visualization and insights
- **Firebase Integration** - Secure cloud storage with Firebase Realtime Database

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18+
- **Component Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Firebase Realtime Database (to be integrated)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
/src
  /app                 # Next.js app router pages
    layout.tsx         # Root layout
    page.tsx           # Landing page
    globals.css        # Global styles
  /components          # React components
    /ui                # shadcn/ui components
      button.tsx       # Button component
      card.tsx         # Card component
  /lib                 # Utility functions
    utils.ts           # Helper utilities
  /hooks               # Custom React hooks (to be added)
  /types               # TypeScript type definitions (to be added)
/public                # Static assets
```

## 🎨 Design Philosophy

- **Minimalistic** - Clean and focused user interface
- **Responsive** - Mobile-first design approach
- **Accessible** - Following best practices for accessibility
- **Type-safe** - Strict TypeScript for reliability

## 🔜 Upcoming Features

- [X] Firebase Realtime Database integration
- [X] Real-time data streaming from sensors
- [ ] Interactive data visualization charts
- [ ] User authentication and profiles
- [ ] Historical data analysis
- [ ] Export data functionality

## 📝 Development Guidelines

- All components must use TypeScript (.tsx files)
- Use functional components with React hooks
- Use shadcn/ui components exclusively for UI elements
- Follow atomic design principles
- Maintain strict TypeScript mode
- Use Tailwind CSS for styling

## 🤝 Contributing

This is a project for concurrent cardiovascular and gait analysis. Follow the development guidelines in `.github/copilot-instructions.md` when contributing.

## 📄 License

Private project - All rights reserved.

---

Built with ❤️ for health monitoring innovation
