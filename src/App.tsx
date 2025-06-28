import React from 'react'
import TaskList from './components/TaskList'
import MoodTracker from './components/MoodTracker'
import SuggestionBox from './components/SuggestionBox'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LifeSync</h1>
          <p className="text-gray-600">Your personal productivity and wellness companion</p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Task Planner */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Tasks</h2>
            <TaskList />
          </div>

          {/* Mood Tracker */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How are you feeling?</h2>
            <MoodTracker />
          </div>

          {/* Insights & Suggestions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Insights & Tips</h2>
            <SuggestionBox />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-500">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App
