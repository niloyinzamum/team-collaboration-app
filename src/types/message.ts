export interface Message {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    senderId: string;
    receiverId: string;
    sender: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
    receiver: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
    files?: {
      id: string;
      url: string;
      name: string;
    }[];
  }