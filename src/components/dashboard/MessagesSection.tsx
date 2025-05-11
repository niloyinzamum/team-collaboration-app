"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Message } from '@/types/message';
import { pusherClient } from '@/lib/pusher';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface MessagesSectionProps {
  projectId: string;
}

export function MessagesSection({ projectId }: MessagesSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Changed to true initially
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user first
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) throw new Error('Failed to fetch user');
        const user = await response.json();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
    fetchCurrentUser();
  }, []); // Remove projectId dependency

  // Then fetch messages when we have both projectId and currentUser
  useEffect(() => {
    async function fetchMessages() {
      if (!projectId || !currentUser) return;
      
      try {
        const response = await fetch(`/api/projects/${projectId}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId && currentUser) {
      fetchMessages();
    }
  }, [projectId, currentUser]);

  // Setup Pusher subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = pusherClient.subscribe(`project-${projectId}`);
    
    channel.bind('new-message', (message: Message) => {
      setMessages(current => [...current, message]);
      scrollToBottom();
    });

    return () => {
      channel.unbind('new-message');
      pusherClient.unsubscribe(`project-${projectId}`);
    };
  }, [projectId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !projectId || !currentUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newMessage,
          projectId: projectId
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-6 border border-white/20 flex flex-col h-[600px]">
      <h2 className="text-lg font-semibold text-black mb-6">Project Messages</h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-black/50">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex items-start p-3 rounded-lg ${
                msg.senderId === currentUser?.id 
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
                    {msg.senderId === currentUser?.id && ' (You)'}
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

      <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2
                   text-black placeholder-black/50 focus:outline-none focus:border-white/40"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                   text-white px-4 py-2 rounded-lg hover:from-purple-600/80 
                   hover:to-indigo-600/80 disabled:opacity-50 transition-all duration-300"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}