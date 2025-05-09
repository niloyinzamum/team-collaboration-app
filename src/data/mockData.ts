import { Project, Message, File } from '../types';

export const projects: Project[] = [
  { id: 1, name: "Marketing Campaign", members: 5, unread: 3 },
  { id: 2, name: "Website Redesign", members: 8, unread: 0 },
  { id: 3, name: "Product Launch", members: 12, unread: 7 }
];

export const recentMessages: Message[] = [
  { id: 1, user: "Sarah Johnson", message: "Can you review the latest design?", time: "10m", avatar: "/api/placeholder/40/40" },
  { id: 2, user: "Mike Peters", message: "Meeting notes are uploaded", time: "1h", avatar: "/api/placeholder/40/40" },
  { id: 3, user: "Emma Wilson", message: "Need your feedback ASAP", time: "3h", avatar: "/api/placeholder/40/40" }
];

export const recentFiles: File[] = [
  { id: 1, name: "Q2 Marketing Plan.pdf", uploadedBy: "You", date: "Today" },
  { id: 2, name: "Homepage Mockup.png", uploadedBy: "Sarah J.", date: "Yesterday" },
  { id: 3, name: "Meeting Notes.docx", uploadedBy: "Mike P.", date: "May 7" }
];