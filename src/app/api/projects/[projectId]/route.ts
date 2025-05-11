import { NextRequest, NextResponse } from "next/server"
import { ProjectService } from "@/lib/services/project.service"
import { getCurrentUser } from "@/lib/auth2"

export async function GET(
  req: NextRequest,
  context: { params: { projectId: string } }
) {
  try {
    const projectId = context.params.projectId
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const project = await ProjectService.findById(projectId)
    if (!project) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { projectId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const project = await ProjectService.update(context.params.projectId, body)
    
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { projectId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await ProjectService.delete(context.params.projectId)
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}