# Local Storage Utilities Documentation

This module provides a comprehensive set of utility functions for managing data in the browser's localStorage for the LifeSync application.

## Overview

The localStorage utilities are organized into several categories:
- **Base Operations**: Core localStorage wrapper functions
- **Task Management**: Functions for managing daily tasks
- **Mood Management**: Functions for tracking mood entries
- **Settings Management**: Functions for app configuration
- **Utility Functions**: Helper functions for common operations

## Features

- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: All functions include comprehensive error handling
- **Server-Side Rendering**: Safe to use in SSR environments (returns null/false when window is undefined)
- **Data Validation**: Built-in validation for data integrity
- **Performance**: Optimized for frequent read/write operations

## Base Operations

### `getFromStorage<T>(key: StorageKey): T | null`
Safely retrieves and parses data from localStorage.

### `setToStorage<T>(key: StorageKey, data: T): boolean`
Safely stores data to localStorage with JSON serialization.

### `removeFromStorage(key: StorageKey): boolean`
Removes a specific key from localStorage.

## Task Management

### Core Functions
- `getAllTasks()`: Get all tasks
- `getTaskById(taskId)`: Get a specific task
- `saveTask(task)`: Create a new task
- `updateTask(taskId, updates)`: Update an existing task
- `deleteTask(taskId)`: Delete a task
- `getFilteredTasks(filter)`: Get tasks matching criteria

### Example Usage

```typescript
import { saveTask, getAllTasks, updateTask } from '../utils/localStorage';

// Create a new task
const success = saveTask({
  title: 'Complete project documentation',
  description: 'Write comprehensive docs for the LifeSync app',
  completed: false,
  priority: 'high',
  category: 'work'
});

// Get all tasks
const tasks = getAllTasks();

// Update a task
updateTask('task-id-123', {
  completed: true,
  priority: 'medium'
});
```

## Mood Management

### Core Functions
- `getAllMoodEntries()`: Get all mood entries
- `saveMoodEntry(mood)`: Record a new mood entry
- `deleteMoodEntry(moodId)`: Delete a mood entry
- `getFilteredMoodEntries(filter)`: Get mood entries matching criteria

### Example Usage

```typescript
import { saveMoodEntry, getAllMoodEntries } from '../utils/localStorage';

// Record a mood entry
const success = saveMoodEntry({
  mood: 'happy',
  intensity: 4,
  notes: 'Had a great day at work!'
});

// Get all mood entries
const moodEntries = getAllMoodEntries();
```

## Settings Management

### Core Functions
- `getAppSettings()`: Get current app settings
- `updateAppSettings(settings)`: Update app settings

### Example Usage

```typescript
import { getAppSettings, updateAppSettings } from '../utils/localStorage';

// Get current settings
const settings = getAppSettings();

// Update settings
updateAppSettings({
  theme: 'dark',
  notifications: false
});
```

## Utility Functions

### Helper Functions
- `getTodayDate()`: Get today's date in YYYY-MM-DD format
- `isLocalStorageAvailable()`: Check if localStorage is available

## Data Types

All functions use strongly typed interfaces defined in `../types/index.ts`:

- `Task`: Task object structure
- `MoodEntry`: Mood entry structure
- `AppSettings`: Application settings structure
- `TaskFilter`: Task filtering criteria
- `MoodFilter`: Mood filtering criteria

## Error Handling

All functions include comprehensive error handling:
- Invalid data is caught and logged
- Functions return `false` or `null` on errors
- Console errors provide detailed debugging information
- Safe fallbacks for SSR environments

## Storage Keys

The module uses predefined storage keys to avoid conflicts:
- `lifesync_tasks`: Task data
- `lifesync_moods`: Mood entries
- `lifesync_settings`: App settings
- `lifesync_analytics_cache`: Analytics cache

## Best Practices

1. **Always check return values**: Functions return boolean success indicators
2. **Use TypeScript**: Leverage the provided types for better development experience
3. **Handle errors gracefully**: Check for null returns and false success indicators
4. **Don't store sensitive data**: localStorage is not secure storage
5. **Consider storage limits**: localStorage has size limitations (usually 5-10MB)

## Testing

To test localStorage functionality:

```typescript
import { isLocalStorageAvailable } from '../utils/localStorage';

if (isLocalStorageAvailable()) {
  // localStorage is available, proceed with operations
} else {
  // Handle fallback behavior
}
``` 