"use client"

import { Task } from "./TaskList"

type TaskItemProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
}

const statusLabels = {
  PENDING: "Pending",
  DONE: "Done",
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const isOverdue =
    task.deadline &&
    task.status !== "DONE" &&
    new Date(task.deadline) < new Date()

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {task.text}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[task.status]
              }`}
            >
              {statusLabels[task.status]}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                Overdue
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
            {task.deadline && (
              <span>
                Due: {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
            {task.finishedTime && (
              <span>
                Finished: {new Date(task.finishedTime).toLocaleDateString()}
              </span>
            )}
            <span>
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
