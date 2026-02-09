"use client"

import { useState, useEffect } from "react"
import { Task } from "./TaskList"

type TaskFormProps = {
  task: Task | null
  onClose: () => void
  onSaved: () => void
}

export default function TaskForm({ task, onClose, onSaved }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [status, setStatus] = useState(task?.status || "TODO")
  const [deadline, setDeadline] = useState(
    task?.deadline ? task.deadline.split("T")[0] : ""
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "")
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks"
      const method = task ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          status,
          deadline: deadline || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      onSaved()
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Add a description (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : task ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
