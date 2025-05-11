export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    projectId: string;
    assignedToId?: string;
    assignedTo?: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }