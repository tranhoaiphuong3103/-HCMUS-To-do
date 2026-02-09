import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma.config"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const where = {
      userId: session.user.id,
      ...(search && {
        text: { contains: search, mode: "insensitive" as const },
      }),
      ...(status && { status: status as any }),
    }

    const orderBy = {
      [sortBy]: sortOrder,
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, status, deadline } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        text,
        status: status || "PENDING",
        deadline: deadline ? new Date(deadline) : null,
        finishedTime: status === "DONE" ? new Date() : null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
