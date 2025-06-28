import type {
  Task,
  TaskFilter,
  MoodEntry,
  MoodFilter,
  AppSettings,
  StorageKey,
} from '../types';
import { STORAGE_KEYS } from '../types';

/**
 * Base Local Storage Operations
 * Provides type-safe wrapper around browser localStorage
 */

/**
 * Safely get data from localStorage with error handling
 * @param key - Storage key to retrieve data from
 * @returns Parsed data or null if not found/error
 */
export const getFromStorage = <T>(key: StorageKey): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  } catch (error) {
    console.error(`Error getting data from localStorage for key "${key}":`, error);
    return null;
  }
};

/**
 * Safely set data to localStorage with error handling
 * @param key - Storage key to save data to
 * @param data - Data to save
 * @returns Success status
 */
export const setToStorage = <T>(key: StorageKey, data: T): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting data to localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Remove data from localStorage
 * @param key - Storage key to remove
 * @returns Success status
 */
export const removeFromStorage = (key: StorageKey): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all LifeSync data from localStorage
 * @returns Success status
 */
export const clearAllData = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all data from localStorage:', error);
    return false;
  }
};

/**
 * Task Management Functions
 */

/**
 * Get all tasks from localStorage
 * @returns Array of tasks or empty array
 */
export const getAllTasks = (): Task[] => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEYS.TASKS);
  return tasks || [];
};

/**
 * Get a specific task by ID
 * @param taskId - ID of the task to retrieve
 * @returns Task or null if not found
 */
export const getTaskById = (taskId: string): Task | null => {
  const tasks = getAllTasks();
  return tasks.find(task => task.id === taskId) || null;
};

/**
 * Save a new task to localStorage
 * @param task - Task object to save
 * @returns Success status
 */
export const saveTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
  try {
    const tasks = getAllTasks();
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    return setToStorage(STORAGE_KEYS.TASKS, tasks);
  } catch (error) {
    console.error('Error saving task:', error);
    return false;
  }
};

/**
 * Update an existing task in localStorage
 * @param taskId - ID of the task to update
 * @param updates - Partial task object with updates
 * @returns Success status
 */
export const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean => {
  try {
    const tasks = getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      console.error(`Task with ID "${taskId}" not found`);
      return false;
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return setToStorage(STORAGE_KEYS.TASKS, tasks);
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

/**
 * Delete a task from localStorage
 * @param taskId - ID of the task to delete
 * @returns Success status
 */
export const deleteTask = (taskId: string): boolean => {
  try {
    const tasks = getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    
    if (filteredTasks.length === tasks.length) {
      console.error(`Task with ID "${taskId}" not found`);
      return false;
    }
    
    return setToStorage(STORAGE_KEYS.TASKS, filteredTasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

/**
 * Get filtered tasks based on criteria
 * @param filter - Filter criteria
 * @returns Array of filtered tasks
 */
export const getFilteredTasks = (filter: TaskFilter): Task[] => {
  const tasks = getAllTasks();
  
  return tasks.filter(task => {
    // Filter by completion status
    if (filter.completed !== undefined && task.completed !== filter.completed) {
      return false;
    }
    
    // Filter by priority
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    
    // Filter by category
    if (filter.category && task.category !== filter.category) {
      return false;
    }
    
    // Filter by date range
    if (filter.dateRange) {
      const taskDate = new Date(task.createdAt);
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      
      if (taskDate < startDate || taskDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Mood Management Functions
 */

/**
 * Get all mood entries from localStorage
 * @returns Array of mood entries or empty array
 */
export const getAllMoodEntries = (): MoodEntry[] => {
  const moods = getFromStorage<MoodEntry[]>(STORAGE_KEYS.MOODS);
  return moods || [];
};

/**
 * Get a specific mood entry by ID
 * @param moodId - ID of the mood entry to retrieve
 * @returns MoodEntry or null if not found
 */
export const getMoodEntryById = (moodId: string): MoodEntry | null => {
  const moods = getAllMoodEntries();
  return moods.find(mood => mood.id === moodId) || null;
};

/**
 * Save a new mood entry to localStorage
 * @param moodEntry - Mood entry object to save
 * @returns Success status
 */
export const saveMoodEntry = (moodEntry: Omit<MoodEntry, 'id' | 'timestamp' | 'date'>): boolean => {
  try {
    const moods = getAllMoodEntries();
    const now = new Date();
    const newMoodEntry: MoodEntry = {
      ...moodEntry,
      id: generateId(),
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0], // YYYY-MM-DD format
    };
    
    moods.push(newMoodEntry);
    return setToStorage(STORAGE_KEYS.MOODS, moods);
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return false;
  }
};

/**
 * Update an existing mood entry in localStorage
 * @param moodId - ID of the mood entry to update
 * @param updates - Partial mood entry object with updates
 * @returns Success status
 */
export const updateMoodEntry = (moodId: string, updates: Partial<Omit<MoodEntry, 'id' | 'timestamp' | 'date'>>): boolean => {
  try {
    const moods = getAllMoodEntries();
    const moodIndex = moods.findIndex(mood => mood.id === moodId);
    
    if (moodIndex === -1) {
      console.error(`Mood entry with ID "${moodId}" not found`);
      return false;
    }
    
    moods[moodIndex] = {
      ...moods[moodIndex],
      ...updates,
    };
    
    return setToStorage(STORAGE_KEYS.MOODS, moods);
  } catch (error) {
    console.error('Error updating mood entry:', error);
    return false;
  }
};

/**
 * Delete a mood entry from localStorage
 * @param moodId - ID of the mood entry to delete
 * @returns Success status
 */
export const deleteMoodEntry = (moodId: string): boolean => {
  try {
    const moods = getAllMoodEntries();
    const filteredMoods = moods.filter(mood => mood.id !== moodId);
    
    if (filteredMoods.length === moods.length) {
      console.error(`Mood entry with ID "${moodId}" not found`);
      return false;
    }
    
    return setToStorage(STORAGE_KEYS.MOODS, filteredMoods);
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return false;
  }
};

/**
 * Get filtered mood entries based on criteria
 * @param filter - Filter criteria
 * @returns Array of filtered mood entries
 */
export const getFilteredMoodEntries = (filter: MoodFilter): MoodEntry[] => {
  const moods = getAllMoodEntries();
  
  return moods.filter(mood => {
    // Filter by mood type
    if (filter.mood && mood.mood !== filter.mood) {
      return false;
    }
    
    // Filter by intensity range
    if (filter.minIntensity !== undefined && mood.intensity < filter.minIntensity) {
      return false;
    }
    
    if (filter.maxIntensity !== undefined && mood.intensity > filter.maxIntensity) {
      return false;
    }
    
    // Filter by date range
    if (filter.dateRange) {
      const moodDate = new Date(mood.date);
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      
      if (moodDate < startDate || moodDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Settings Management Functions
 */

/**
 * Get app settings from localStorage
 * @returns App settings or default settings
 */
export const getAppSettings = (): AppSettings => {
  const settings = getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS);
  
  // Return default settings if none exist
  if (!settings) {
    return {
      theme: 'light',
      notifications: true,
      dailyReminders: true,
      weeklyAnalytics: true,
      defaultTaskPriority: 'medium',
    };
  }
  
  return settings;
};

/**
 * Update app settings in localStorage
 * @param settings - App settings to save
 * @returns Success status
 */
export const updateAppSettings = (settings: Partial<AppSettings>): boolean => {
  try {
    const currentSettings = getAppSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    return setToStorage(STORAGE_KEYS.SETTINGS, updatedSettings);
  } catch (error) {
    console.error('Error updating app settings:', error);
    return false;
  }
};

/**
 * Utility Functions
 */

/**
 * Generate a unique ID for new entries
 * @returns Unique string ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get date range for the current week
 * @returns Object with start and end dates
 */
export const getCurrentWeekRange = (): { start: string; end: string } => {
  const now = new Date();
  const startOfWeek = new Date(now);
  const endOfWeek = new Date(now);
  
  // Get Monday as start of week
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(now.getDate() - daysToMonday);
  
  // Get Sunday as end of week
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return {
    start: startOfWeek.toISOString().split('T')[0],
    end: endOfWeek.toISOString().split('T')[0],
  };
};

/**
 * Check if localStorage is available
 * @returns Boolean indicating localStorage availability
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}; 