import React, { useState, useEffect } from 'react';
import type { MoodType, MoodEntry } from '../types';
import { getAllMoodEntries, saveMoodEntry, deleteMoodEntry } from '../utils/localStorage';

interface MoodOption {
  mood: MoodType;
  emoji: string;
  color: string;
  bgColor: string;
}

const moodOptions: MoodOption[] = [
  { mood: 'happy', emoji: '😊', color: 'text-yellow-600', bgColor: 'bg-yellow-100 hover:bg-yellow-200' },
  { mood: 'excited', emoji: '🤩', color: 'text-orange-600', bgColor: 'bg-orange-100 hover:bg-orange-200' },
  { mood: 'calm', emoji: '😌', color: 'text-blue-600', bgColor: 'bg-blue-100 hover:bg-blue-200' },
  { mood: 'motivated', emoji: '💪', color: 'text-green-600', bgColor: 'bg-green-100 hover:bg-green-200' },
  { mood: 'confident', emoji: '😎', color: 'text-purple-600', bgColor: 'bg-purple-100 hover:bg-purple-200' },
  { mood: 'tired', emoji: '😴', color: 'text-gray-600', bgColor: 'bg-gray-100 hover:bg-gray-200' },
  { mood: 'stressed', emoji: '😰', color: 'text-red-600', bgColor: 'bg-red-100 hover:bg-red-200' },
  { mood: 'anxious', emoji: '😟', color: 'text-yellow-700', bgColor: 'bg-yellow-100 hover:bg-yellow-200' },
  { mood: 'sad', emoji: '😢', color: 'text-blue-700', bgColor: 'bg-blue-100 hover:bg-blue-200' },
  { mood: 'overwhelmed', emoji: '🤯', color: 'text-red-700', bgColor: 'bg-red-100 hover:bg-red-200' },
];

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [todaysMoods, setTodaysMoods] = useState<MoodEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    loadTodaysMoods();
  }, []);

  const loadTodaysMoods = () => {
    const allMoods = getAllMoodEntries();
    const today = new Date().toISOString().split('T')[0];
    const todaysEntries = allMoods.filter(mood => mood.date === today);
    setTodaysMoods(todaysEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setIsLogging(true);
  };

  const handleSaveMood = () => {
    if (!selectedMood) return;

    const success = saveMoodEntry({
      mood: selectedMood,
      intensity,
      notes: notes.trim() || undefined,
    });

    if (success) {
      // Reset form
      setSelectedMood(null);
      setIntensity(3);
      setNotes('');
      setIsLogging(false);
      
      // Reload today's moods
      loadTodaysMoods();
    }
  };

  const handleDeleteMood = (moodId: string) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      const success = deleteMoodEntry(moodId);
      if (success) {
        loadTodaysMoods();
      }
    }
  };

  const cancelLogging = () => {
    setSelectedMood(null);
    setIntensity(3);
    setNotes('');
    setIsLogging(false);
  };

  const getMoodOption = (mood: MoodType): MoodOption => {
    return moodOptions.find(option => option.mood === mood) || moodOptions[0];
  };

  const getIntensityText = (intensity: number): string => {
    switch (intensity) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Moderate';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Moderate';
    }
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAverageMood = (): number => {
    if (todaysMoods.length === 0) return 0;
    const sum = todaysMoods.reduce((acc, mood) => acc + mood.intensity, 0);
    return Math.round((sum / todaysMoods.length) * 10) / 10;
  };

  return (
    <div className="space-y-4">
      {/* Mood Selection Grid */}
      {!isLogging ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">How are you feeling?</h3>
            {todaysMoods.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {showHistory ? 'Hide' : 'Show'} Today's History
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.mood}
                onClick={() => handleMoodSelect(option.mood)}
                className={`${option.bgColor} ${option.color} p-4 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-md`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-xs font-medium capitalize">{option.mood}</span>
              </button>
            ))}
          </div>

          {/* Today's Summary */}
          {todaysMoods.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-600">Mood Entries Today</div>
                  <div className="text-lg font-bold text-blue-600">{todaysMoods.length}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-600">Average Intensity</div>
                  <div className="text-lg font-bold text-green-600">{getAverageMood()}/5</div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Mood Logging Form */
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getMoodOption(selectedMood!).emoji}</span>
            <div>
              <h4 className="font-semibold text-gray-800 capitalize">
                Feeling {selectedMood}
              </h4>
              <p className="text-sm text-gray-600">How intense is this feeling?</p>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Intensity: {getIntensityText(intensity)} ({intensity}/5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Very Low</span>
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's making you feel this way? Any thoughts to remember..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={cancelLogging}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMood}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Save Mood
            </button>
          </div>
        </div>
      )}

      {/* Today's Mood History */}
      {showHistory && todaysMoods.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Today's Mood History</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todaysMoods.map((mood) => {
              const option = getMoodOption(mood.mood);
              return (
                <div key={mood.id} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium capitalize">{mood.mood}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">Intensity: {mood.intensity}/5</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{formatTime(mood.timestamp)}</span>
                      </div>
                      {mood.notes && (
                        <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMood(mood.id)}
                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-100 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todaysMoods.length === 0 && !isLogging && (
        <div className="text-center py-6 text-gray-500">
          <div className="text-4xl mb-2">🌟</div>
          <p>Track your first mood of the day!</p>
          <p className="text-sm">Select how you're feeling above to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker; 