import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma.config"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { text, status, deadline } = await req.json()

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (existingTask.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(text !== undefined && { text: text }),
        ...(status !== undefined && {
          status: status as any,
          finishedTime: status === "DONE" ? new Date() : null
        }),
        ...(deadline !== undefined && {
          deadline: deadline ? new Date(deadline) : null,
        }),
      } as any,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (existingTask.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
