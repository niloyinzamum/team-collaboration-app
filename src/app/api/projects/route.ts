import { NextRequest, NextResponse } from "next/server"
import { ProjectService } from "../../../../src/lib/services/project.service"
import { getCurrentUser } from "@/lib/auth2"

export async function POST(req: NextRequest) {
  try {

    const user = await getCurrentUser()
    console.log("User in POST:", user)
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const project = await ProjectService.create(user.id, body)
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const projects = await ProjectService.findAll(user.id)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}