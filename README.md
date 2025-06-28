# LifeSync 🌟

> Your personal productivity and wellness companion

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/FurtulaIgor/LifeSync)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1+-teal.svg)](https://tailwindcss.com/)

LifeSync is a modern, responsive web application designed to help you sync your life, mood, and productivity. Built with the latest web technologies, it provides an intuitive interface for task management, mood tracking, and insightful analytics to improve your daily well-being and productivity.

## ✨ Key Features

### 📋 **Smart Task Management**
- ✅ Create, edit, and delete tasks with ease
- 🎯 Set priority levels (High, Medium, Low)
- ⏰ Track completion status with timestamps
- 📊 Visual task completion analytics
- 🏷️ Organize tasks by categories and priorities

### 🎭 **Advanced Mood Tracking**
- 😊 Track 10+ different mood types (happy, excited, calm, motivated, confident, tired, stressed, anxious, sad, overwhelmed)
- 📈 Intensity levels from 1-10 for precise mood measurement
- 🕐 Timestamped mood entries for pattern analysis
- 🎨 Color-coded mood visualization
- 📊 Weekly mood trend analysis

### 🤖 **AI-Powered Smart Suggestions**
- 💡 Personalized motivational tips based on your current state
- 🎯 Productivity recommendations tailored to your task completion patterns
- 🌱 Wellness advice that adapts to your mood patterns
- 📝 Contextual task prioritization suggestions
- 🔄 Dynamic suggestions that update based on your activity

### 📊 **Comprehensive Weekly Analytics**
- 📈 Interactive charts powered by Recharts library
- 📊 Productivity trend analysis with week-over-week comparisons
- 🎭 Mood distribution insights with visual breakdowns
- 📋 Task completion statistics and patterns
- 🔍 Three specialized view modes: Overview, Productivity, and Mood
- 📉 Trend indicators showing improvement or decline areas

### 🎨 **Modern UI/UX Design**
- 📱 Fully responsive design (mobile-first approach)
- 🎨 Beautiful pastel color scheme with rounded components
- ♿ WCAG 2.1 accessibility compliant
- 🌙 Clean, intuitive interface with smooth animations
- ⚡ Optimized performance with fast loading times
- 🎯 Touch-friendly design for mobile devices

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript for type safety
- **Build Tool**: Vite 7.0 for fast development and optimized builds
- **Styling**: Tailwind CSS v4 with custom design system
- **Charts & Visualization**: Recharts for interactive data visualization
- **Data Storage**: Browser localStorage with type-safe utilities
- **Icons**: Unicode emojis for universal compatibility
- **Deployment**: Production-ready with Vercel configuration

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/FurtulaIgor/LifeSync.git
   cd LifeSync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📖 Usage Guide

### Getting Started with LifeSync

#### 1. **Managing Your Tasks**
- **Adding Tasks**: Click the task input field, type your task description, select priority level, and press Enter
- **Editing Tasks**: Click on any existing task to edit its content or priority
- **Completing Tasks**: Click the checkbox to mark tasks as completed
- **Deleting Tasks**: Use the delete option to remove unwanted tasks

#### 2. **Tracking Your Mood**
- **Select Mood Type**: Choose from 10 different mood categories
- **Set Intensity**: Use the intensity slider (1-10) to specify how strongly you feel
- **Automatic Saving**: Your mood is automatically saved with timestamp for analysis

#### 3. **Viewing Analytics**
- **Overview Tab**: See combined productivity and mood trends
- **Productivity Tab**: Focus on task completion patterns and productivity insights
- **Mood Tab**: Analyze mood distributions and emotional patterns
- **Weekly Insights**: Compare current week with previous periods

#### 4. **Smart Suggestions**
- **Motivational Tips**: Get personalized encouragement based on your progress
- **Productivity Advice**: Receive recommendations for better task management
- **Wellness Tips**: Get mood-based suggestions for mental health
- **Task Prioritization**: Smart recommendations for which tasks to tackle first

## 🏗️ Project Architecture

```
LifeSync/
├── public/                    # Static assets
│   └── vite.svg              # Vite logo
├── src/
│   ├── components/           # React components
│   │   ├── TaskList.tsx      # Task management component
│   │   ├── MoodTracker.tsx   # Mood tracking interface
│   │   ├── SuggestionBox.tsx # AI-powered suggestions
│   │   ├── WeeklyAnalytics.tsx # Data visualization component
│   │   └── ResponsiveTestSuite.tsx # Development testing tool
│   ├── styles/              # Styling and design system
│   │   └── design-system.css # Custom CSS variables and utilities
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared interfaces and types
│   ├── utils/               # Utility functions
│   │   ├── localStorage.ts  # Data persistence utilities
│   │   └── README.md        # Utilities documentation
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles and Tailwind imports
│   └── vite-env.d.ts        # Vite type definitions
├── DEPLOYMENT.md            # Comprehensive deployment guide
├── LifeSync-Tasks.md        # Project development progress
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── vercel.json              # Vercel deployment configuration
└── README.md                # This documentation
```

## ⚡ Available Scripts

### Development Commands
```bash
npm run dev              # Start development server with hot reload
npm run build            # Create production build
npm run preview          # Preview production build locally
npm run preview:production # Preview with production settings
```

### Quality Assurance
```bash
npm run lint             # Run ESLint for code quality
npm run lint:fix         # Automatically fix ESLint errors
npm run type-check       # Run TypeScript type checking
npm run health-check     # Complete project health verification
```

### Deployment Commands
```bash
npm run deploy:vercel    # Deploy directly to Vercel
npm run deploy:netlify   # Deploy directly to Netlify
npm run clean           # Clean build artifacts and cache
```

## 🌐 Deployment Options

LifeSync is optimized for modern deployment platforms with multiple deployment options:

### Option 1: Vercel (Recommended)
```bash
npm run deploy:vercel
```
- Automatic builds from GitHub
- Built-in performance monitoring
- Edge network distribution

### Option 2: Netlify
```bash
npm run deploy:netlify
```
- Continuous deployment from Git
- Form handling capabilities
- Branch previews

### Option 3: Manual Deployment
```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🎯 Performance Metrics

- **Bundle Size**: ~566KB total (171KB gzipped)
- **Load Time**: < 3 seconds on standard connections
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Mobile Responsive**: Optimized for devices from iPhone SE to Desktop 4K
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🔧 Development Features

### Data Management
- **Local Storage**: All data is stored locally in your browser
- **Type Safety**: Full TypeScript implementation for error prevention
- **Data Validation**: Input validation and error handling
- **Export Ready**: Prepared for future data export/import features

### UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: Screen reader support, keyboard navigation, high contrast
- **Animations**: Smooth transitions and loading states
- **Touch Support**: Optimized for touch devices with appropriate target sizes

### Developer Experience
- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense support
- **ESLint**: Code quality enforcement
- **Modular Architecture**: Clean component separation and organization

## 🤝 Contributing

We welcome contributions to LifeSync! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Add appropriate documentation for new features
- Ensure accessibility standards are met
- Test on multiple browsers and devices

## 📊 Future Roadmap

### Short-term Goals
- [ ] Dark/Light theme toggle
- [ ] Data export/import functionality
- [ ] Enhanced accessibility features
- [ ] Performance optimizations

### Medium-term Goals
- [ ] Goal setting and tracking system
- [ ] Calendar integration
- [ ] Notification system
- [ ] Advanced analytics dashboard

### Long-term Vision
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Cloud synchronization
- [ ] AI-powered insights and predictions

## 🛡️ Security & Privacy

- **Local Data Storage**: All your data stays in your browser
- **No External Tracking**: Privacy-focused design with no third-party analytics
- **Secure Build**: Production builds include security headers and optimizations
- **Type Safety**: TypeScript prevents common security vulnerabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the incredible React framework
- **Vite Team**: For the blazing-fast build tool
- **Tailwind CSS**: For the utility-first CSS framework
- **Recharts**: For the beautiful chart library
- **TypeScript**: For type safety and developer experience

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/FurtulaIgor/LifeSync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FurtulaIgor/LifeSync/discussions)
- **Documentation**: This README and [DEPLOYMENT.md](./DEPLOYMENT.md)

---

<div align="center">

**Built with ❤️ for better productivity and wellness**

[⭐ Star this repository](https://github.com/FurtulaIgor/LifeSync) if you found it helpful!

</div>
