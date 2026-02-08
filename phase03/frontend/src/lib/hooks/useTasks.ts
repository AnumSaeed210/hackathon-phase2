'use client'

/**
 * useTasks Hook
 * Custom hook for managing task operations
 */

import { useState, useCallback } from 'react'
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/lib/api/types'
import { apiClient } from '@/lib/api/client'


/**
 * Transform task from API (snake_case) to frontend (camelCase)
 * Ensures timestamps are properly parsed as UTC
 */
function transformTask(task: any): Task {
  // Ensure timestamps are in UTC by appending Z if missing
  const normalizeTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return new Date().toISOString()
    const str = String(timestamp)
    // If it doesn't have timezone info, assume it's UTC
    if (!str.includes('Z') && !str.includes('+') && !str.includes('-00:00')) {
      return `${str}Z`
    }
    return str
  }

  return {
    id: String(task.id),
    userId: task.user_id,
    title: task.title,
    description: task.description,
    completed: task.status === 'complete',
    priority: task.priority,
    dueDate: task.due_date ? normalizeTimestamp(task.due_date) : undefined,
    tags: task.tags || [],
    createdAt: normalizeTimestamp(task.created_at),
    updatedAt: normalizeTimestamp(task.updated_at),
  }
}

export interface UseTasksResult {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  fetchTasks: (userId: string) => Promise<void>
  createTask: (userId: string, data: CreateTaskRequest) => Promise<Task>
  updateTask: (userId: string, taskId: string, data: UpdateTaskRequest) => Promise<Task>
  completeTask: (userId: string, taskId: string) => Promise<Task>
  incompleteTask: (userId: string, taskId: string) => Promise<Task>
  deleteTask: (userId: string, taskId: string) => Promise<void>
  clearError: () => void
  filteredAndSortedTasks: Task[]
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  setSortBy: (sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title') => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  allTags: string[]
  toggleTag: (tag: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // State for filtering and sorting
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Function to get all unique tags
  const getAllTags = useCallback((): string[] => {
    const allTagsSet = new Set<string>();
    tasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach(tag => allTagsSet.add(tag));
      }
    });
    return Array.from(allTagsSet).sort();
  }, [tasks]);

  // Function to toggle a tag in the selected tags
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // Function to get filtered and sorted tasks
  const getFilteredAndSortedTasks = useCallback((): Task[] => {
    let filteredTasks = [...tasks];

    // Apply filter
    if (filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filteredTasks = filteredTasks.filter(task => {
        if (!task.tags || !Array.isArray(task.tags)) return false;
        return selectedTags.some(tag => task.tags?.includes(tag));
      });
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) {
            comparison = 0;
          } else if (!a.dueDate) {
            comparison = 1; // Put tasks without due date at the end
          } else if (!b.dueDate) {
            comparison = -1;
          } else {
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          break;
        case 'priority':
          // Define priority order: low < medium < high
          const priorityOrder: Record<string, number> = { 'low': 1, 'medium': 2, 'high': 3 };
          const aPriority = a.priority || 'medium';
          const bPriority = b.priority || 'medium';
          comparison = (priorityOrder[aPriority] || 2) - (priorityOrder[bPriority] || 2);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredTasks;
  }, [tasks, filter, selectedTags, searchQuery, sortBy, sortOrder]);

  const fetchTasks = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const taskData = await apiClient.get<any[]>(`/api/${userId}/tasks`)
      setTasks(taskData.map(transformTask))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTask = useCallback(
    async (userId: string, data: CreateTaskRequest): Promise<Task> => {
      setIsLoading(true)
      setError(null)

      try {
        const newTaskData = await apiClient.post<any>(`/api/${userId}/tasks`, data)
        const newTask = transformTask(newTaskData)

        // Optimistic update
        setTasks((prev) => [...prev, newTask])

        return newTask
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create task'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const updateTask = useCallback(
    async (userId: string, taskId: string, data: UpdateTaskRequest): Promise<Task> => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedTaskData = await apiClient.put<any>(
          `/api/${userId}/tasks/${taskId}`,
          data
        )
        const updatedTask = transformTask(updatedTaskData)

        // Optimistic update
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        )

        return updatedTask
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update task'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const completeTask = useCallback(
    async (userId: string, taskId: string): Promise<Task> => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedTaskData = await apiClient.patch<any>(
          `/api/${userId}/tasks/${taskId}/status`,
          { status: 'complete' }
        )
        const updatedTask = transformTask(updatedTaskData)

        // Optimistic update
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        )

        return updatedTask
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to complete task'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const incompleteTask = useCallback(
    async (userId: string, taskId: string): Promise<Task> => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedTaskData = await apiClient.patch<any>(
          `/api/${userId}/tasks/${taskId}/status`,
          { status: 'incomplete' }
        )
        const updatedTask = transformTask(updatedTaskData)

        // Optimistic update
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        )

        return updatedTask
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mark task incomplete'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const deleteTask = useCallback(
    async (userId: string, taskId: string): Promise<void> => {
      setIsLoading(true)
      setError(null)

      try {
        await apiClient.delete(`/api/${userId}/tasks/${taskId}`)

        // Optimistic update
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete task'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    incompleteTask,
    deleteTask,
    clearError,
    filteredAndSortedTasks: getFilteredAndSortedTasks(),
    setFilter,
    setSortBy,
    setSortOrder,
    selectedTags,
    setSelectedTags,
    allTags: getAllTags(),
    toggleTag,
    searchQuery,
    setSearchQuery,
  }
}
