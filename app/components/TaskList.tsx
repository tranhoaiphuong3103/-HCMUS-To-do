"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TaskItem from "./TaskItem"
import TaskForm from "./TaskForm"
import TaskFilters from "./TaskFilters"

export type Task = {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
  deadline: string | null
  createdAt: string
  updatedAt: string
}

export default function TaskList() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (statusFilter) params.append("status", statusFilter)
      params.append("sortBy", sortBy)
      params.append("sortOrder", sortOrder)

      const response = await fetch(`/api/tasks?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [search, statusFilter, sortBy, sortOrder])

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowForm(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const handleTaskSaved = () => {
    fetchTasks()
    handleCloseForm()
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">My Tasks</h1>
        <button
          onClick={handleCreateTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + New Task
        </button>
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
          onSaved={handleTaskSaved}
        />
      )}

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No tasks found. Create your first task to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
