'use client';

/**
 * TaskFilters Component
 * Provides filtering and sorting options for tasks
 */

import React from 'react';

interface TaskFiltersProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  onSortChange: (sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export function TaskFilters({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Filter Selection */}
      <div className="flex-1">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as 'all' | 'active' | 'completed')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Sort By Selection */}
      <div className="flex-1">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'createdAt' | 'dueDate' | 'priority' | 'title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Sort Order Selection */}
      <div className="flex-1">
        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
          Order
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}