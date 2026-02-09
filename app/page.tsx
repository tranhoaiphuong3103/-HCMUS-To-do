import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Header from "./components/Header"
import TaskList from "./components/TaskList"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header user={session.user} />
      <main className="py-8">
        <TaskList />
      </main>
    </div>
  )
}
