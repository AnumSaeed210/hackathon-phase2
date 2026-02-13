"use client";

/**
 * Agent Dashboard Page
 * Dedicated page for AI agent functionality
 */

import { useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { Button } from "@/components/common/Button";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/lib/hooks/useTasks";

export default function AgentPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    createTask,
    deleteTask,
    completeTask,
    updateTask
  } = useTasks();
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [agentMessage, setAgentMessage] = useState("");

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Please sign in to access the agent dashboard</p>
      </div>
    );
  }

  const handleCreateTaskWithAgent = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      setAgentMessage("Agent is creating your task...");
      
      await createTask(user.id, {
        title: newTaskTitle,
        description: newTaskDescription,
        priority: "medium"
      });
      
      setNewTaskTitle("");
      setNewTaskDescription("");
      setAgentMessage("Task created successfully by the agent!");
      
      setTimeout(() => setAgentMessage(""), 3000);
    } catch (err) {
      setAgentMessage("Error creating task with agent");
      setTimeout(() => setAgentMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Agent Dashboard</h1>
        <p className="text-gray-600">Your intelligent task management assistant</p>
      </div>

      {/* Agent Status Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-semibold text-blue-900">Agent Status: Online</h2>
        </div>
        <p className="text-blue-800">
          Your AI agent is ready to help manage your tasks. Create, update, or organize your tasks with AI assistance.
        </p>
      </div>

      {/* Agent Action Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Task with Agent</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What would you like to do?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Add more details about your task..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <Button 
            onClick={handleCreateTaskWithAgent}
            variant="primary"
            className="w-full sm:w-auto"
          >
            🤖 Create Task with Agent
          </Button>
        </div>
        
        {agentMessage && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{agentMessage}</p>
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
        
        {tasks.length > 0 ? (
          <TaskList 
            tasks={tasks.slice(0, 5)} // Show only the 5 most recent tasks
            isLoading={isLoading}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">No tasks yet. Create your first task above!</p>
        )}
      </div>

      {/* Agent Capabilities */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900">Create Tasks</h4>
          <p className="text-green-800 text-sm">Add new tasks with AI suggestions</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900">Organize</h4>
          <p className="text-purple-800 text-sm">Automatically sort and prioritize</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900">Assist</h4>
          <p className="text-yellow-800 text-sm">Get help with task management</p>
        </div>
      </div>
    </div>
  );
}