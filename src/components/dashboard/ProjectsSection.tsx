import { useEffect, useState, useRef } from 'react';
import { Project } from '@prisma/client';
import Image from 'next/image';
import { Task } from '../../types/tasks';
import { TaskModal } from './TaskModal';
import { TaskList } from './TaskList';
import { format } from 'date-fns';
import { pusherClient } from '@/lib/pusher';

// Add Message type
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

// Update ExtendedProject interface to include messages
interface ExtendedProject extends Project {
  members: {
    id: string;
    name: string;
    email: string;
    image: string;
  }[];
  manager: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  tasks: Task[];
  messages?: Message[];
}

interface ProjectsSectionProps {
  className?: string;
}

export function ProjectsSection({ className = '' }: ProjectsSectionProps) {
  // Add new state for messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ExtendedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [activeView, setActiveView] = useState<'tasks' | 'messages'>('tasks');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update handleViewProject to fetch messages
  const handleViewProject = async (projectId: string) => {
    try {
      const [projectResponse, messagesResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/messages`)
      ]);

      if (!projectResponse.ok || !messagesResponse.ok) {
        throw new Error('Failed to fetch project data');
      }

      const [project, messages] = await Promise.all([
        projectResponse.json(),
        messagesResponse.json()
      ]);

      setSelectedProject(project);
      setMessages(messages);
      setActiveView('messages');
      scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add message sending handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProject) return;

    setIsMessageLoading(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  // Add Pusher subscription for real-time messages
  useEffect(() => {
    if (!selectedProject) return;

    const channel = pusherClient.subscribe(`project-${selectedProject.id}`);
    
    channel.bind('new-message', (message: Message) => {
      setMessages(current => [...current, message]);
      scrollToBottom();
    });

    return () => {
      channel.unbind('new-message');
      pusherClient.unsubscribe(`project-${selectedProject.id}`);
    };
  }, [selectedProject]);

  const handleTaskSave = async (taskData: Partial<Task>) => {
    try {
      const url = taskData.id 
        ? `/api/projects/${selectedProject?.id}/tasks/${taskData.id}`
        : `/api/projects/${selectedProject?.id}/tasks`;
      
      const response = await fetch(url, {
        method: taskData.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error('Failed to save task');
      
      if (selectedProject) {
        handleViewProject(selectedProject.id);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const renderProjectsList = () => (
    <div className="space-y-4">
      {projects.map(project => (
        <div
          key={project.id}
          onClick={() => handleViewProject(project.id)}
          className={`flex items-center justify-between p-4 rounded-lg transition duration-300 cursor-pointer
            ${selectedProject?.id === project.id ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
        >
          <div>
            <h3 className="font-medium text-black">{project.name}</h3>
            <div className="flex items-center gap-4 mt-1 text-black/70 text-sm">
              <span>{project.members.length} members</span>
              <span>{project.tasks?.length || 0} </span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map(member => (
              <Image
                key={member.id}
                src={member.image || '/default-avatar.png'}
                alt={member.name || 'Member avatar'}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Update renderProjectDetails to include messages section
  const renderProjectDetails = () => (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-black font-semibold">{selectedProject?.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('tasks')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'tasks' 
                  ? 'bg-purple-500/20 text-purple-700' 
                  : 'bg-white/10 hover:bg-white/20 text-black/70'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveView('messages')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'messages' 
                  ? 'bg-purple-500/20 text-purple-700' 
                  : 'bg-white/10 hover:bg-white/20 text-black/70'
              }`}
            >
              Messages
            </button>
          </div>
        </div>
        <p className="text-black/70 mt-2">{selectedProject?.description}</p>
      </div>

      {activeView === 'messages' ? (
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-black/50">
                No messages yet
              </div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex items-start p-3 rounded-lg ${
                    msg.senderId === selectedProject?.managerId
                      ? 'bg-purple-500/20 ml-auto' 
                      : 'bg-white/10'
                  } max-w-[80%]`}
                >
                  <Image
                    src={msg.sender.image || '/default-avatar.png'}
                    alt={msg.sender.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-black text-sm">
                        {msg.sender.name}
                      </p>
                      <span className="text-xs text-black/70">
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-black/80 mt-1">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2
                       text-black placeholder-black/50 focus:outline-none focus:border-white/40"
              disabled={isMessageLoading}
            />
            <button
              type="submit"
              disabled={isMessageLoading}
              className="bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                       text-white px-4 py-2 rounded-lg hover:from-purple-600/80 
                       hover:to-indigo-600/80 disabled:opacity-50 transition-all duration-300"
            >
              {isMessageLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Task List Section */}
          <div>

            <TaskList
              projectId={selectedProject?.id || ''}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onNewTask={() => {
                setSelectedTask(undefined);
                setIsTaskModalOpen(true);
              }}
            />
          </div>

          {/* Team Members Section */}
          <div>
            <h3 className="font-medium mb-3">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject?.members.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                >
                  <Image
                    src={member.image || '/default-avatar.png'}
                    alt={member.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={`grid grid-cols-12 gap-6 ${className}`}>
      {/* Projects List Column */}
      <div className="col-span-5 bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Active Projects</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          renderProjectsList()
        )}
      </div>

      {/* Project Details Column */}
      <div className="col-span-7 text-black bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-6 border border-white/20">
        {selectedProject ? renderProjectDetails() : (
          <div className="text-center text-black/70 py-8">
            Select a project to view details
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projectId={selectedProject?.id || ''}
        onSave={handleTaskSave}
      />
    </div>
  );
}