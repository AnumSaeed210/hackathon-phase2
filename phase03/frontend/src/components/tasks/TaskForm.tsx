'use client'

/**
 * TaskForm Component
 * Form for creating and editing tasks
 */

import React, { useState, useEffect } from 'react'
import { Task, CreateTaskRequest } from '@/lib/api/types'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { ErrorAlert } from '@/components/common/ErrorAlert'
import { PrioritySelector } from '@/components/common/PrioritySelector'
import { validateTaskForm } from '@/lib/validation/tasks'

interface TaskFormProps {
  initialTask?: Task
  onSubmit: (data: CreateTaskRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  error?: string | null
  onErrorDismiss?: () => void
}

export function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  onErrorDismiss,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'medium',
    dueDate: initialTask?.dueDate || '',
    tags: initialTask?.tags || [],
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isEditing = !!initialTask

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationError = validateTaskForm(formData.title, formData.description, formData.dueDate)

    if (validationError) {
      setFieldErrors({ [validationError.field]: validationError.message })
      return
    }

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority || 'medium',
        dueDate: formData.dueDate || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      })
    } catch {
      // Error is handled by parent
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit Task' : 'Create Task'}
        </h2>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          🤖 Agent
        </span>
      </div>
      
      {error && (
        <ErrorAlert
          message={error}
          title={isEditing ? 'Update Failed' : 'Creation Failed'}
          onDismiss={onErrorDismiss}
        />
      )}

      <Input
        label="Task Title"
        type="text"
        name="title"
        id="title"
        required
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        error={fieldErrors.title}
        disabled={isLoading}
        helpText="3-200 characters"
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          disabled={isLoading}
          rows={4}
          className={`
            mt-1 w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors
            ${fieldErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          `}
        />
        {fieldErrors.description && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Maximum 1000 characters</p>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date (Optional)
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isLoading}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors
            ${fieldErrors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          `}
        />
        {fieldErrors.dueDate && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.dueDate}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => {
            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            setFormData(prev => ({ ...prev, tags }));
          }}
          placeholder="work, personal, urgent..."
          disabled={isLoading}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors
            ${fieldErrors.tags ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          `}
        />
        {fieldErrors.tags && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.tags}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      <PrioritySelector
        value={formData.priority}
        onChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
        label="Priority"
      />

      <div className="flex gap-3">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="flex-1"
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
