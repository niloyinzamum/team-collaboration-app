import { User } from "./user"

export interface JWTPayload {
  id: string
  email: string
  role: string
}

export interface AuthResponse {
  user: User
  token: string
}