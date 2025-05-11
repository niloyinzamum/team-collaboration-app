import {  NextResponse } from "next/server"
import { ProjectService } from "@/lib/services/project.service"
import { getCurrentUser } from "@/lib/auth2"

export async function GET(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/')
    const projectId = segments[3] // ['', 'api', 'projects', 'projectId']

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

export async function PATCH(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/')
    const projectId = segments[3]

    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const project = await ProjectService.update(projectId, body)
    
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const segments = new URL(req.url).pathname.split('/')
    const projectId = segments[3]

    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await ProjectService.delete(projectId)
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}