import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth2";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/');
    const projectId = segments[3]; // ['', 'api', 'projects', 'projectId', 'tasks', 'taskId']
    const taskId = segments[5];

    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const task = await db.task.update({
      where: {
        id: taskId,
        projectId: projectId
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        assignedToId: body.assignedToId
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
    console.error("Error updating task:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/');
    const projectId = segments[3];
    const taskId = segments[5];

    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.task.delete({
      where: {
        id: taskId,
        projectId: projectId
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}