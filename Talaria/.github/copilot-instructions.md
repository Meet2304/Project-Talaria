# Talaria Web Application - Copilot Instructions

## Project Overview
Talaria is a web application for concurrent cardiovascular and gait analysis. It collects data from MPU6050 (accelerometer/gyroscope) and MAX30102 (heart rate/SpO2) sensors, stores it in Firebase Realtime Database, and provides real-time data viewing and analytics.

## Technology Stack
- **Framework**: Next.js with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18+
- **Component Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Code Style**: ESLint + Prettier

## Development Guidelines

### Component Rules
- ALL components MUST use TypeScript (.tsx files)
- Use functional components with React hooks
- Use shadcn/ui components exclusively for UI elements
- Follow atomic design principles (atoms, molecules, organisms)

### TypeScript Rules
- Enable strict mode in tsconfig.json
- Define explicit types for all props and state
- Use interfaces for component props
- Avoid using `any` type - use `unknown` or proper typing

### Styling Rules
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain minimalistic and clean design aesthetic
- Use shadcn/ui theming system

### Code Organization
- Group related components in feature folders
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper file naming: PascalCase for components

### Firebase Integration
- Use Firebase SDK v9+ modular syntax
- Implement proper error handling for database operations
- Use real-time listeners for live data updates
- Secure database access with Firebase rules

## Project Structure
```
/app - Next.js app router pages
/components - React components
/lib - Utility functions and Firebase config
/hooks - Custom React hooks
/types - TypeScript type definitions
/public - Static assets
```

## Best Practices
- Write clean, self-documenting code
- Add comments for complex logic only
- Implement proper error boundaries
- Use environment variables for sensitive data
- Follow Next.js 14+ best practices
