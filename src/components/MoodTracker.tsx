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
    <div className="lifesync-section">
      {/* Mood Selection Grid */}
      {!isLogging ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="lifesync-heading-4">How are you feeling?</h3>
            {todaysMoods.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="lifesync-btn lifesync-btn-sm lifesync-btn-secondary"
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
                className={`lifesync-mood-btn ${option.bgColor} ${option.color} focus:ring-2 focus:ring-blue-500`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="lifesync-caption font-medium capitalize">{option.mood}</span>
              </button>
            ))}
          </div>

          {todaysMoods.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center lifesync-body-sm">
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
        <div className="lifesync-card border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getMoodOption(selectedMood!).emoji}</span>
            <div>
              <h4 className="lifesync-heading-4 capitalize">
                Feeling {selectedMood}
              </h4>
              <p className="lifesync-body-sm">How intense is this feeling?</p>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-2">
            <label className="block lifesync-body-sm font-medium text-gray-700">
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
            <div className="flex justify-between lifesync-caption text-gray-500">
              <span>Very Low</span>
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block lifesync-body-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's making you feel this way? Any thoughts to remember..."
              rows={3}
              className="lifesync-textarea"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={cancelLogging}
              className="lifesync-btn lifesync-btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMood}
              className="lifesync-btn lifesync-btn-primary"
            >
              Save Mood
            </button>
          </div>
        </div>
      )}

      {/* Today's Mood History */}
      {showHistory && todaysMoods.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 lifesync-fade-in">
          <h4 className="lifesync-heading-4 mb-3">Today's Mood History</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {todaysMoods.slice().reverse().map((mood) => (
              <div
                key={mood.id}
                className="flex items-center justify-between bg-white p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getMoodOption(mood.mood).emoji}</span>
                  <div>
                    <div className="lifesync-body-sm font-medium capitalize">
                      {mood.mood}
                    </div>
                    <div className="lifesync-caption text-gray-500">
                      Intensity: {mood.intensity}/5 • {formatTime(mood.timestamp)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMood(mood.id)}
                  className="lifesync-btn lifesync-btn-sm lifesync-btn-danger"
                  title="Delete mood entry"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todaysMoods.length === 0 && !isLogging && (
        <div className="text-center py-6 text-gray-500">
          <div className="text-4xl mb-2">🌟</div>
          <p className="lifesync-body">Track your first mood of the day!</p>
          <p className="lifesync-body-sm">Select how you're feeling above to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker; 