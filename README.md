# LifeSync - Personal Productivity & Wellness App

LifeSync is a comprehensive personal productivity and wellness companion that helps you manage your daily tasks, track your emotional well-being, and gain insights into your productivity patterns.

## Features

- **📋 Daily Task Planner**: Create, edit, and manage your daily tasks with ease
- **😊 Emotional Tracker**: Track your moods and emotional states throughout the day
- **💡 Suggestion Engine**: Get personalized motivational tips and daily priorities
- **📊 Weekly Analytics**: Visualize your mood and productivity patterns over time
- **🎨 Modern UI**: Beautiful, responsive design with a pastel theme and rounded components

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Data Storage**: Local Storage (browser-based)
- **Charts**: Chart.js or Recharts (to be implemented)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LifeSync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── styles/        # Custom CSS and styling utilities
├── utils/         # Utility functions (local storage, etc.)
├── types/         # TypeScript type definitions
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── index.css      # Global styles and Tailwind imports
```

## Development Roadmap

### ✅ Completed
- [x] Project initialization with Vite + React + TypeScript
- [x] Tailwind CSS v4 configuration
- [x] Basic project structure
- [x] Initial UI layout and design

### 🚧 In Progress / Planned
- [ ] Local Storage utility implementation
- [ ] Task List component development
- [ ] Mood tracking functionality
- [ ] Suggestion engine
- [ ] Weekly analytics with charts
- [ ] Responsive design optimization
- [ ] Unit and integration testing
- [ ] Production deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies
- Inspired by productivity and wellness best practices
- Designed with user experience and mental health in mind
