import React, { useState, useEffect } from 'react';
import type { Task, MoodEntry, Suggestion } from '../types';
import { getAllTasks, getAllMoodEntries, getTodayDate } from '../utils/localStorage';

interface SuggestionData {
  motivational: Suggestion[];
  productivity: Suggestion[];
  wellness: Suggestion[];
  taskPriority: Suggestion[];
}

const SuggestionBox: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SuggestionData>({
    motivational: [],
    productivity: [],
    wellness: [],
    taskPriority: [],
  });
  const [activeTab, setActiveTab] = useState<keyof SuggestionData>('motivational');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const generateSuggestions = () => {
    setIsLoading(true);
    
    const tasks = getAllTasks();
    const moods = getAllMoodEntries();
    const today = getTodayDate();
    
    // Filter today's data
    const todaysTasks = tasks.filter(task => 
      task.createdAt.split('T')[0] === today
    );
    const todaysMoods = moods.filter(mood => mood.date === today);
    
    // Calculate metrics
    const completedTasks = todaysTasks.filter(task => task.completed).length;
    const totalTasks = todaysTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Get latest mood
    const latestMood = todaysMoods.length > 0 
      ? todaysMoods.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null;
    
    const averageMoodIntensity = todaysMoods.length > 0
      ? todaysMoods.reduce((sum, mood) => sum + mood.intensity, 0) / todaysMoods.length
      : 3;

    // Generate suggestions
    const newSuggestions: SuggestionData = {
      motivational: generateMotivationalSuggestions(completionRate, latestMood),
      productivity: generateProductivitySuggestions(todaysTasks, completionRate),
      wellness: generateWellnessSuggestions(latestMood, todaysMoods),
      taskPriority: generateTaskPrioritySuggestions(todaysTasks, latestMood),
    };

    setSuggestions(newSuggestions);
    setIsLoading(false);
  };

  const generateMotivationalSuggestions = (completionRate: number, latestMood: MoodEntry | null): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    if (completionRate >= 80) {
      suggestions.push({
        id: 'motivation-1',
        type: 'motivational',
        title: '🎉 Incredible Progress!',
        message: "You're crushing it today! Your productivity is through the roof.",
        actionable: false,
      });
    } else if (completionRate >= 50) {
      suggestions.push({
        id: 'motivation-2',
        type: 'motivational',
        title: '💪 Great Work!',
        message: "You're making solid progress today. Keep up the momentum!",
        actionable: false,
      });
    } else {
      suggestions.push({
        id: 'motivation-3',
        type: 'motivational',
        title: '✨ Fresh Start!',
        message: "Every day is a new opportunity. Start with one small task!",
        actionable: true,
        action: 'Start with your highest priority task',
      });
    }

    if (latestMood && ['happy', 'excited', 'motivated'].includes(latestMood.mood)) {
      suggestions.push({
        id: 'motivation-4',
        type: 'motivational',
        title: '🚀 Ride the Wave!',
        message: `You're feeling ${latestMood.mood} - perfect time for challenging tasks!`,
        actionable: true,
        action: 'Focus on your most important task',
        basedOnMood: latestMood.mood,
      });
    }

    return suggestions.slice(0, 2);
  };

  const generateProductivitySuggestions = (tasks: Task[], completionRate: number): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const pendingHighPriority = tasks.filter(task => !task.completed && task.priority === 'high').length;

    if (pendingHighPriority > 0) {
      suggestions.push({
        id: 'productivity-1',
        type: 'productivity',
        title: '🎯 High Priority Alert',
        message: `You have ${pendingHighPriority} high-priority task${pendingHighPriority > 1 ? 's' : ''} pending.`,
        actionable: true,
        action: 'Focus on high-priority tasks',
      });
    }

    suggestions.push({
      id: 'productivity-2',
      type: 'productivity',
      title: '🎧 Focus Mode',
      message: 'Try the Pomodoro Technique: 25 minutes focused work, 5-minute break.',
      actionable: true,
      action: 'Use time-blocking for better focus',
    });

    if (tasks.length === 0) {
      suggestions.push({
        id: 'productivity-3',
        type: 'productivity',
        title: '📝 Plan Your Day',
        message: 'Start by adding a few tasks to organize your day.',
        actionable: true,
        action: 'Add your first task',
      });
    }

    return suggestions.slice(0, 2);
  };

  const generateWellnessSuggestions = (latestMood: MoodEntry | null, todaysMoods: MoodEntry[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    if (latestMood) {
      switch (latestMood.mood) {
        case 'stressed':
        case 'anxious':
          suggestions.push({
            id: 'wellness-1',
            type: 'wellness',
            title: '🌸 Breathing Exercise',
            message: 'Try 4-7-8 breathing: Inhale 4, hold 7, exhale 8. Repeat 3-4 times.',
            actionable: true,
            action: 'Take 5 minutes for deep breathing',
            basedOnMood: latestMood.mood,
          });
          break;
        case 'tired':
          suggestions.push({
            id: 'wellness-2',
            type: 'wellness',
            title: '☕ Energy Boost',
            message: 'Try a 10-15 minute walk or light stretching to boost energy.',
            actionable: true,
            action: 'Take a short walk or stretch',
            basedOnMood: latestMood.mood,
          });
          break;
      }
    }

    suggestions.push({
      id: 'wellness-3',
      type: 'wellness',
      title: '💧 Stay Hydrated',
      message: 'Remember to drink water throughout the day for better focus.',
      actionable: true,
      action: 'Drink a glass of water now',
    });

    if (todaysMoods.length === 0) {
      suggestions.push({
        id: 'wellness-4',
        type: 'wellness',
        title: '📊 Check In With Yourself',
        message: 'Log your mood to improve self-awareness and track patterns.',
        actionable: true,
        action: 'Log your current mood',
      });
    }

    return suggestions.slice(0, 2);
  };

  const generateTaskPrioritySuggestions = (tasks: Task[], latestMood: MoodEntry | null): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const pendingTasks = tasks.filter(task => !task.completed);

    if (pendingTasks.length === 0) {
      suggestions.push({
        id: 'priority-1',
        type: 'task_priority',
        title: '🎉 All Caught Up!',
        message: 'Great job! Consider planning for tomorrow or taking a break.',
        actionable: true,
        action: 'Plan tomorrow or take a break',
      });
      return suggestions;
    }

    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
    if (highPriorityTasks.length > 0) {
      suggestions.push({
        id: 'priority-2',
        type: 'task_priority',
        title: '🚨 Focus on High Priority',
        message: `Start with "${highPriorityTasks[0].title}" for biggest impact.`,
        actionable: true,
        action: `Work on: ${highPriorityTasks[0].title}`,
      });
    }

    if (latestMood && ['tired', 'overwhelmed'].includes(latestMood.mood)) {
      const easyTasks = pendingTasks.filter(t => t.priority === 'low');
      if (easyTasks.length > 0) {
        suggestions.push({
          id: 'priority-3',
          type: 'task_priority',
          title: '🌱 Start Small',
          message: `Try "${easyTasks[0].title}" to build momentum.`,
          actionable: true,
          action: `Start easy: ${easyTasks[0].title}`,
          basedOnMood: latestMood.mood,
        });
      }
    }

    return suggestions.slice(0, 2);
  };

  const getTabIcon = (tab: keyof SuggestionData): string => {
    switch (tab) {
      case 'motivational': return '💪';
      case 'productivity': return '⚡';
      case 'wellness': return '🌸';
      case 'taskPriority': return '🎯';
      default: return '💡';
    }
  };

  const getTabLabel = (tab: keyof SuggestionData): string => {
    switch (tab) {
      case 'motivational': return 'Motivate';
      case 'productivity': return 'Focus';
      case 'wellness': return 'Wellness';
      case 'taskPriority': return 'Tasks';
      default: return 'Tips';
    }
  };

  return (
    <div className="lifesync-section">
      {/* Tab Navigation */}
      <div className="lifesync-tabs overflow-hidden">
        {Object.keys(suggestions).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as keyof SuggestionData)}
            className={`flex-1 min-w-0 py-2 px-1 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'lifesync-tab-active'
                : 'lifesync-tab-inactive'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-base leading-none">{getTabIcon(tab as keyof SuggestionData)}</span>
              <span className="text-xs leading-none truncate w-full text-center">{getTabLabel(tab as keyof SuggestionData)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h3 className="lifesync-heading-4">
          {getTabLabel(activeTab)} Tips
        </h3>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="lifesync-btn lifesync-btn-sm lifesync-btn-secondary"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <div className="lifesync-loading text-2xl mb-2">⚡</div>
            <p className="lifesync-body-sm">Analyzing your data...</p>
          </div>
        ) : suggestions[activeTab].length > 0 ? (
          suggestions[activeTab].map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4 space-y-2 lifesync-fade-in"
            >
              <h4 className="lifesync-heading-4 text-sm">
                {suggestion.title}
              </h4>
              <p className="lifesync-body-sm leading-relaxed">
                {suggestion.message}
              </p>
              {suggestion.actionable && suggestion.action && (
                <div className="bg-white bg-opacity-50 rounded-md p-2 border-l-4 border-blue-400">
                  <p className="lifesync-caption text-blue-700 font-medium">
                    💡 Action: {suggestion.action}
                  </p>
                </div>
              )}
              {suggestion.basedOnMood && (
                <div className="lifesync-caption text-purple-600 font-medium">
                  Based on your {suggestion.basedOnMood} mood
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-2xl mb-2">💡</div>
            <p className="lifesync-body-sm">No suggestions available.</p>
            <p className="lifesync-caption mt-1">Try adding tasks or logging your mood!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionBox; 