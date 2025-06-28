import React from 'react'
import TaskList from './components/TaskList'
import MoodTracker from './components/MoodTracker'
import SuggestionBox from './components/SuggestionBox'
import WeeklyAnalytics from './components/WeeklyAnalytics'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="lifesync-container">
        {/* Header */}
        <header className="text-center mb-8 lifesync-fade-in">
          <h1 className="lifesync-heading-1 mb-2">LifeSync</h1>
          <p className="lifesync-body">Your personal productivity and wellness companion</p>
        </header>

        {/* Main Content Grid */}
        <div className="lifesync-grid-main mb-6">
          {/* Daily Task Planner */}
          <div className="lifesync-card lifesync-card-body lifesync-slide-in">
            <h2 className="lifesync-heading-2 mb-4">Today's Tasks</h2>
            <TaskList />
          </div>

          {/* Mood Tracker */}
          <div className="lifesync-card lifesync-card-body lifesync-slide-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="lifesync-heading-2 mb-4">How are you feeling?</h2>
            <MoodTracker />
          </div>

          {/* Insights & Suggestions */}
          <div className="lifesync-card lifesync-card-body lifesync-slide-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="lifesync-heading-2 mb-4">Insights & Tips</h2>
            <SuggestionBox />
          </div>
        </div>

        {/* Weekly Analytics Section */}
        <div className="lifesync-card lifesync-card-body mb-6 lifesync-scale-in" style={{ animationDelay: '0.3s' }}>
          <WeeklyAnalytics />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 lifesync-caption">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App
