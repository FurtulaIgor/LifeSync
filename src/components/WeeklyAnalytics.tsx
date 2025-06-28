import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Task, MoodEntry, MoodType } from '../types';
import { getAllTasks, getAllMoodEntries } from '../utils/localStorage';

interface DailyData {
  date: string;
  dayName: string;
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
  averageMoodIntensity: number;
  moodCount: number;
  dominantMood?: MoodType;
}

interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  dailyData: DailyData[];
  weeklyAverages: {
    completionRate: number;
    averageMoodIntensity: number;
    tasksPerDay: number;
    moodEntriesPerDay: number;
  };
  trends: {
    productivityTrend: 'increasing' | 'decreasing' | 'stable';
    moodTrend: 'improving' | 'declining' | 'stable';
  };
  moodDistribution: { mood: MoodType; count: number; color: string }[];
}

const WeeklyAnalytics: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyStats | null>(null);
  const [viewMode, setViewMode] = useState<'productivity' | 'mood' | 'overview'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateWeeklyAnalytics();
  }, []);

  const moodColors: Record<MoodType, string> = {
    happy: '#FCD34D',
    excited: '#FB923C',
    calm: '#60A5FA',
    motivated: '#34D399',
    confident: '#A78BFA',
    tired: '#9CA3AF',
    stressed: '#F87171',
    anxious: '#FDE047',
    sad: '#93C5FD',
    overwhelmed: '#EF4444',
  };

  const generateWeeklyAnalytics = () => {
    setIsLoading(true);

    const tasks = getAllTasks();
    const moods = getAllMoodEntries();

    // Get current week range
    const now = new Date();
    const weekStart = new Date(now);
    const weekEnd = new Date(now);
    
    // Get Monday as start of week
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(now.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    // Get Sunday as end of week
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Generate daily data for the week
    const dailyData: DailyData[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      const dateStr = currentDay.toISOString().split('T')[0];

      // Filter tasks for this day
      const dayTasks = tasks.filter(task => 
        task.createdAt.split('T')[0] === dateStr
      );
      const completedTasks = dayTasks.filter(task => task.completed);

      // Filter moods for this day
      const dayMoods = moods.filter(mood => mood.date === dateStr);
      const avgMoodIntensity = dayMoods.length > 0
        ? dayMoods.reduce((sum, mood) => sum + mood.intensity, 0) / dayMoods.length
        : 0;

      // Find dominant mood
      const moodCounts = dayMoods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {} as Record<MoodType, number>);
      const dominantMood = Object.keys(moodCounts).length > 0
        ? Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0] as MoodType] > moodCounts[b[0] as MoodType] ? a : b)[0] as MoodType
        : undefined;

      dailyData.push({
        date: dateStr,
        dayName: dayNames[i],
        tasksCompleted: completedTasks.length,
        totalTasks: dayTasks.length,
        completionRate: dayTasks.length > 0 ? (completedTasks.length / dayTasks.length) * 100 : 0,
        averageMoodIntensity: Math.round(avgMoodIntensity * 10) / 10,
        moodCount: dayMoods.length,
        dominantMood,
      });
    }

    // Calculate weekly averages
    const weeklyAverages = {
      completionRate: dailyData.reduce((sum, day) => sum + day.completionRate, 0) / 7,
      averageMoodIntensity: dailyData.reduce((sum, day) => sum + day.averageMoodIntensity, 0) / 7,
      tasksPerDay: dailyData.reduce((sum, day) => sum + day.totalTasks, 0) / 7,
      moodEntriesPerDay: dailyData.reduce((sum, day) => sum + day.moodCount, 0) / 7,
    };

    // Calculate trends
    const firstHalf = dailyData.slice(0, 3);
    const secondHalf = dailyData.slice(4, 7);
    
    const firstHalfProductivity = firstHalf.reduce((sum, day) => sum + day.completionRate, 0) / firstHalf.length;
    const secondHalfProductivity = secondHalf.reduce((sum, day) => sum + day.completionRate, 0) / secondHalf.length;
    
    const firstHalfMood = firstHalf.reduce((sum, day) => sum + day.averageMoodIntensity, 0) / firstHalf.length;
    const secondHalfMood = secondHalf.reduce((sum, day) => sum + day.averageMoodIntensity, 0) / secondHalf.length;

    const productivityTrend = secondHalfProductivity > firstHalfProductivity + 5 
      ? 'increasing' 
      : secondHalfProductivity < firstHalfProductivity - 5 
        ? 'decreasing' 
        : 'stable';
    
    const moodTrend = secondHalfMood > firstHalfMood + 0.5 
      ? 'improving' 
      : secondHalfMood < firstHalfMood - 0.5 
        ? 'declining' 
        : 'stable';

    // Calculate mood distribution
    const weekMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate >= weekStart && moodDate <= weekEnd;
    });

    const moodDistribution = Object.entries(
      weekMoods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {} as Record<MoodType, number>)
    ).map(([mood, count]) => ({
      mood: mood as MoodType,
      count,
      color: moodColors[mood as MoodType],
    })).sort((a, b) => b.count - a.count);

    setWeeklyData({
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      dailyData,
      weeklyAverages: {
        completionRate: Math.round(weeklyAverages.completionRate * 10) / 10,
        averageMoodIntensity: Math.round(weeklyAverages.averageMoodIntensity * 10) / 10,
        tasksPerDay: Math.round(weeklyAverages.tasksPerDay * 10) / 10,
        moodEntriesPerDay: Math.round(weeklyAverages.moodEntriesPerDay * 10) / 10,
      },
      trends: { productivityTrend, moodTrend },
      moodDistribution,
    });

    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return '📈';
      case 'decreasing':
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return 'text-green-600';
      case 'decreasing':
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="lifesync-loading text-3xl mb-4">📊</div>
        <p className="lifesync-body">Analyzing your weekly data...</p>
      </div>
    );
  }

  if (!weeklyData) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-4">📈</div>
        <p className="lifesync-body">No data available for analysis.</p>
        <p className="lifesync-body-sm mt-2">Start tracking tasks and moods to see insights!</p>
      </div>
    );
  }

  return (
    <div className="lifesync-section">
      {/* Header with View Mode Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="lifesync-heading-3">Weekly Analytics</h3>
          <p className="lifesync-body-sm">
            {formatDate(weeklyData.weekStart)} - {formatDate(weeklyData.weekEnd)}
          </p>
        </div>
        
        <div className="lifesync-tabs">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'productivity', label: 'Tasks', icon: '✅' },
            { key: 'mood', label: 'Mood', icon: '😊' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key as typeof viewMode)}
              className={`lifesync-tab ${
                viewMode === key
                  ? 'lifesync-tab-active'
                  : 'lifesync-tab-inactive'
              }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Summary Cards */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 lifesync-fade-in">
            <div className="lifesync-caption text-blue-800 font-medium">Avg Completion Rate</div>
            <div className="text-2xl font-bold text-blue-900">{weeklyData.weeklyAverages.completionRate}%</div>
            <div className={`lifesync-caption ${getTrendColor(weeklyData.trends.productivityTrend)}`}>
              {getTrendIcon(weeklyData.trends.productivityTrend)} {weeklyData.trends.productivityTrend}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 lifesync-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="lifesync-caption text-green-800 font-medium">Avg Mood</div>
            <div className="text-2xl font-bold text-green-900">{weeklyData.weeklyAverages.averageMoodIntensity}/5</div>
            <div className={`lifesync-caption ${getTrendColor(weeklyData.trends.moodTrend)}`}>
              {getTrendIcon(weeklyData.trends.moodTrend)} {weeklyData.trends.moodTrend}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 lifesync-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="lifesync-caption text-purple-800 font-medium">Tasks/Day</div>
            <div className="text-2xl font-bold text-purple-900">{weeklyData.weeklyAverages.tasksPerDay}</div>
            <div className="lifesync-caption text-purple-600">average</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 lifesync-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="lifesync-caption text-yellow-800 font-medium">Mood Entries</div>
            <div className="text-2xl font-bold text-yellow-900">{weeklyData.weeklyAverages.moodEntriesPerDay}</div>
            <div className="lifesync-caption text-yellow-600">per day</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="lifesync-card bg-white rounded-lg p-4 border">
        {viewMode === 'overview' && (
          <div className="space-y-6">
            <div>
              <h4 className="lifesync-heading-4 mb-4">Daily Trends</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dayName" />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Completion Rate (%)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="averageMoodIntensity" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Mood Intensity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'productivity' && (
          <div>
            <h4 className="lifesync-heading-4 mb-4">Task Completion</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasksCompleted" fill="#3B82F6" name="Completed Tasks" />
                <Bar dataKey="totalTasks" fill="#E5E7EB" name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === 'mood' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="lifesync-heading-4 mb-4">Daily Mood Intensity</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dayName" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageMoodIntensity" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Mood Intensity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {weeklyData.moodDistribution.length > 0 && (
              <div>
                <h4 className="lifesync-heading-4 mb-4">Mood Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={weeklyData.moodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="count"
                      nameKey="mood"
                    >
                      {weeklyData.moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1 mt-2 lifesync-caption">
                  {weeklyData.moodDistribution.slice(0, 6).map((item) => (
                    <div key={item.mood} className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="capitalize">{item.mood}</span>
                      <span className="text-gray-500">({item.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={generateWeeklyAnalytics}
          disabled={isLoading}
          className="lifesync-btn lifesync-btn-primary"
        >
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
};

export default WeeklyAnalytics; 