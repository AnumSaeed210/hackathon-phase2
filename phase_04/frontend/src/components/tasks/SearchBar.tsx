'use client';

/**
 * SearchBar Component
 * Provides search functionality for tasks
 */

import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ searchQuery, onSearchChange, onClearSearch }, ref) => {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search-bar-input"
          ref={ref}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';