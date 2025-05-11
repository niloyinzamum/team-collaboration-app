import { User } from "./user"
import { File } from "./index"

// Define minimal user info type for UI display
export interface UserInfo {
  id: string
  name: string
  email: string
  image: string
}

export interface Project {
  id: string
  name: string
  description?: string
  managerId: string
  createdAt: Date
  updatedAt: Date
  manager?: User
  members?: User[]
  files?: File[]
}

export interface CreateProjectDto {
  name: string
  description?: string
  memberIds?: string[]
}

export interface UpdateProjectDto {
  name?: string
  description?: string
  memberIds?: string[]
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: string
  assignee?: UserInfo
}

export interface DetailedProject extends Omit<Project, 'manager' | 'members' | 'files'> {
  manager: UserInfo
  members: UserInfo[]
  tasks: Task[]
  files: {
    id: string
    name: string
    url: string
  }[]
}

