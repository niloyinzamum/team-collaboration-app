import { User } from "./user"
import { Project } from "./project"
import { Message } from "./index"

export interface File {
  id: string
  name: string
  type: string
  size: number
  url: string
  key: string
  createdAt: Date
  uploaderId: string
  uploader?: User
  projectId?: string
  project?: Project
  messageId?: string
  message?: Message
}