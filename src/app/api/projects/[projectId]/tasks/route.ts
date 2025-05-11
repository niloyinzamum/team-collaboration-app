import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth2";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/');
    const projectId = segments[3]; // ['', 'api', 'projects', 'projectId', 'tasks']

    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tasks = await db.task.findMany({
      where: {
        projectId: projectId
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/');
    const projectId = segments[3];

    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Verify that the assignedToId exists if provided
    if (body.assignedToId) {
      const assignedUser = await db.user.findUnique({
        where: { id: body.assignedToId }
      });

      if (!assignedUser) {
        return new NextResponse(
          "Assigned user not found", 
          { status: 400 }
        );
      }
    }

    // Create task with optional assignedToId
    const task = await db.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        projectId: projectId,
        ...(body.assignedToId ? { assignedToId: body.assignedToId } : {})
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}