import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { getAllTasks, saveTask, updateTask, deleteTask } from '../utils/localStorage';

interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  category: string;
  dueDate: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getAllTasks();
    setTasks(loadedTasks);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
    });
    setIsAddingTask(false);
    setEditingTaskId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    if (!formData.title.trim()) return;

    const success = saveTask({
      title: formData.title,
      description: formData.description || undefined,
      completed: false,
      priority: formData.priority,
      category: formData.category || undefined,
      dueDate: formData.dueDate || undefined,
    });

    if (success) {
      loadTasks();
      resetForm();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category || '',
      dueDate: task.dueDate || '',
    });
    setIsAddingTask(true);
  };

  const handleUpdateTask = () => {
    if (!editingTaskId || !formData.title.trim()) return;

    const success = updateTask(editingTaskId, {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      category: formData.category || undefined,
      dueDate: formData.dueDate || undefined,
    });

    if (success) {
      loadTasks();
      resetForm();
    }
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    const success = updateTask(taskId, { completed });
    if (success) {
      loadTasks();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const success = deleteTask(taskId);
      if (success) {
        loadTasks();
      }
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          Today's Tasks ({tasks.filter(t => !t.completed).length} pending)
        </h3>
        <button
          onClick={() => setIsAddingTask(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span>+</span>
          Add Task
        </button>
      </div>

      {/* Add/Edit Task Form */}
      {isAddingTask && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-800">
            {editingTaskId ? 'Edit Task' : 'Add New Task'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                name="title"
                placeholder="Task title *"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <textarea
                name="description"
                placeholder="Task description (optional)"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                name="category"
                placeholder="Category (optional)"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={editingTaskId ? handleUpdateTask : handleAddTask}
              disabled={!formData.title.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {editingTaskId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`border-l-4 rounded-lg p-4 transition-all duration-200 ${getPriorityColor(task.priority)} ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleToggleComplete(task.id, e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span className="capitalize">Priority: {task.priority}</span>
                      {task.category && <span>Category: {task.category}</span>}
                      {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-100 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-100 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Summary */}
      {tasks.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-gray-600">Total</div>
              <div className="text-lg font-bold text-gray-800">{tasks.length}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-600">Completed</div>
              <div className="text-lg font-bold text-green-600">
                {tasks.filter(t => t.completed).length}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-600">Pending</div>
              <div className="text-lg font-bold text-blue-600">
                {tasks.filter(t => !t.completed).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 