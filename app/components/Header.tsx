"use client"

import { signOut } from "next-auth/react"

type HeaderProps = {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-white">
              {user.name || "User"}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
