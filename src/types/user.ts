export interface User {
    id: string
    name: string
    email: string
    image?: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
  }
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER'
  }