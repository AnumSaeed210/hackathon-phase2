"use client";

/**
 * Task List Page
 * Main dashboard showing user's tasks
 */

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { useTasks } from "@/lib/hooks/useTasks";
import { Button } from "@/components/common/Button";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TagFilter } from "@/components/tasks/TagFilter";
import { SearchBar } from "@/components/tasks/SearchBar";
import { KeyboardShortcuts } from "@/components/tasks/KeyboardShortcuts";
import { EmptyState } from "@/components/tasks/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function TasksPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    tasks,
    filteredAndSortedTasks,
    isLoading,
    error,
    fetchTasks,
    deleteTask,
    completeTask,
    incompleteTask,
    clearError,
    setFilter,
    setSortBy,
    setSortOrder,
    selectedTags,
    toggleTag,
    allTags,
    searchQuery,
    setSearchQuery,
  } = useTasks();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [currentSortBy, setCurrentSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'title'>('createdAt');
  const [currentSortOrder, setCurrentSortOrder] = useState<'asc' | 'desc'>('desc');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const loadTasks = async () => {
      try {
        await fetchTasks(user.id);
      } catch {
        // Error is handled by the hook
      } finally {
        setIsInitialized(true);
      }
    };

    loadTasks();
  }, [isAuthenticated, user?.id, fetchTasks]);

  // Show loading state while initializing
  if (!isInitialized && isLoading) {
    return <LoadingSpinner message="Loading your tasks..." />;
  }

  // Handle unauthenticated access
  if (!isAuthenticated || !user?.id) {
    return null; // Middleware should redirect to signin
  }

  const handleEdit = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(user.id, taskId);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      // Find the task to check its current state
      const task = tasks.find((t) => t.id === taskId);
      if (task?.completed) {
        // If already completed, mark as incomplete
        await incompleteTask(user.id, taskId);
      } else {
        // If not completed, mark as complete
        await completeTask(user.id, taskId);
      }
    } catch {
      // Error is handled by the hook
    }
  };

  const handleCreateClick = () => {
    router.push("/tasks/new");
  };

  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Calculate statistics based on filtered tasks
  const completedCount = filteredAndSortedTasks.filter((t) => t.completed).length;
  const incompleteCount = filteredAndSortedTasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{
                color: "#323843",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Tasks
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              🤖 Agent
            </span>
          </div>
          <p className="mt-2 text-gray-600">Organize and track your work with AI assistance</p>
        </div>
        <Button
          onClick={handleCreateClick}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center whitespace-nowrap w-full sm:w-auto"
        >
          <Plus size={18} />
          Create Task
        </Button>
      </div>

      {/* Statistics */}
      {filteredAndSortedTasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border border-violet-light bg-white p-4">
            <div className="flex items-center gap-2">
              <Circle size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {incompleteCount}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-violet-light bg-white p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount}
                </p>
              </div>
            </div>
          </div>
          {filteredAndSortedTasks.length > 0 && (
            <div className="rounded-lg border border-violet-light bg-white p-4">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((completedCount / filteredAndSortedTasks.length) * 100)}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          message={error}
          title="Failed to load tasks"
          onDismiss={clearError}
        />
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onCreateTask={handleCreateClick}
        onFocusSearch={handleFocusSearch}
        onClearSearch={handleClearSearch}
      />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <SearchBar
            ref={searchInputRef}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>
        
        <TaskFilters
          filter={currentFilter}
          onFilterChange={(filter) => {
            setCurrentFilter(filter);
            setFilter(filter);
          }}
          sortBy={currentSortBy}
          onSortChange={(sortBy) => {
            setCurrentSortBy(sortBy);
            setSortBy(sortBy);
          }}
          sortOrder={currentSortOrder}
          onSortOrderChange={(order) => {
            setCurrentSortOrder(order);
            setSortOrder(order);
          }}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
          />
        </div>
      </div>

      {/* Task List */}
      {filteredAndSortedTasks.length > 0 ? (
        <TaskList
          tasks={filteredAndSortedTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onComplete={handleComplete}
          isLoading={isLoading}
        />
      ) : (
        <EmptyState onCreateClick={handleCreateClick} />
      )}
    </div>
  );
}
