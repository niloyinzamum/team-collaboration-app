// src/types/index.ts

export interface Project {
    id: number;
    name: string;
    members: number;
    unread: number;
  }
  
  export interface Message {
    id: number;
    user: string;
    message: string;
    time: string;
    avatar: string;
  }
  
  export interface File {
    id: number;
    name: string;
    uploadedBy: string;
    date: string;
  }

  export * from './user'
export * from './project'
export * from './file'