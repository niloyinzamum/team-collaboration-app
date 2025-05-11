import { db } from "@/lib/db"
import { CreateProjectDto, UpdateProjectDto } from "@/types/project"

export class ProjectService {
  static async create(userId: string, data: CreateProjectDto) {
    return db.project.create({
      data: {
        name: data.name,
        description: data.description,
        manager: { connect: { id: userId } },
        members: {
          connect: data.memberIds?.map(id => ({ id })) || []
        }
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })
  }

  static async findAll(userId: string) {
    return db.project.findMany({
      where: {
        OR: [
          { managerId: userId },
          { members: { some: { id: userId } } }
        ]
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })
  }

  static async findById(projectId: string) {
    return db.project.findUnique({
      where: { id: projectId },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        files: true
      }
    })
  }

  static async update(projectId: string, data: UpdateProjectDto) {
    return db.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        members: data.memberIds ? {
          set: data.memberIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        manager: true,
        members: true
      }
    })
  }

  static async delete(projectId: string) {
    return db.project.delete({
      where: { id: projectId }
    })
  }
}