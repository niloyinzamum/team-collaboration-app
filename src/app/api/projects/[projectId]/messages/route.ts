import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth2";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    // Get projectId from URL segments
    const segments = new URL(req.url).pathname.split('/');
    const projectId = segments[3]; // ['', 'api', 'projects', 'projectId', 'messages']

    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Get project manager as receiver
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { managerId: true }
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const message = await db.message.create({
      data: {
        content: body.content,
        senderId: user.id,
        receiverId: project.managerId, // Project manager will receive the message
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        files: true
      }
    });

    await pusherServer.trigger(`project-${projectId}`, 'new-message', message);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Get projectId from URL segments
    const segments = new URL(req.url).pathname.split('/');
    const projectId = segments[3];

    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get project manager
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { managerId: true }
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Fetch messages where user is either sender or receiver
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        files: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}