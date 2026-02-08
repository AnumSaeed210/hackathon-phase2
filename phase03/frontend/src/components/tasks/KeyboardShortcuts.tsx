'use client';

/**
 * KeyboardShortcuts Component
 * Provides keyboard shortcuts for common task actions
 */

import { useEffect, useRef } from 'react';

interface KeyboardShortcutsProps {
  onCreateTask: () => void;
  onFocusSearch: () => void;
  onClearSearch: () => void;
}

export function KeyboardShortcuts({ onCreateTask, onFocusSearch, onClearSearch }: KeyboardShortcutsProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when in an input field (except for search)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.target.id !== 'search-bar-input') {
          return;
        }
      }

      // Ctrl/Cmd + K: Focus search bar
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onFocusSearch();
      }
      
      // Escape: Clear search
      if (e.key === 'Escape') {
        onClearSearch();
      }
      
      // Ctrl/Cmd + N: Create new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onCreateTask();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCreateTask, onFocusSearch, onClearSearch]);

  return null; // This component doesn't render anything
}