// Task-related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  category?: string;
}

export interface TaskFilter {
  completed?: boolean;
  priority?: Task['priority'];
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Mood-related types
export type MoodType = 'happy' | 'sad' | 'anxious' | 'motivated' | 'tired' | 'excited' | 'calm' | 'stressed' | 'confident' | 'overwhelmed';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  intensity: number; // 1-5 scale
  notes?: string;
  timestamp: string;
  date: string; // YYYY-MM-DD format
}

export interface MoodFilter {
  mood?: MoodType;
  dateRange?: {
    start: string;
    end: string;
  };
  minIntensity?: number;
  maxIntensity?: number;
}

// Analytics-related types
export interface DailyStats {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
  averageMoodIntensity: number;
  dominantMood?: MoodType;
  moodEntries: number;
}

export interface WeeklyAnalytics {
  weekStart: string;
  weekEnd: string;
  dailyStats: DailyStats[];
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
}

// Suggestion-related types
export interface Suggestion {
  id: string;
  type: 'motivational' | 'productivity' | 'wellness' | 'task_priority';
  title: string;
  message: string;
  actionable?: boolean;
  action?: string;
  basedOnMood?: MoodType;
  basedOnProductivity?: number;
}

// Local storage keys
export const STORAGE_KEYS = {
  TASKS: 'lifesync_tasks',
  MOODS: 'lifesync_moods',
  SETTINGS: 'lifesync_settings',
  ANALYTICS_CACHE: 'lifesync_analytics_cache',
} as const;

// Utility types
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dailyReminders: boolean;
  weeklyAnalytics: boolean;
  defaultTaskPriority: Task['priority'];
} 