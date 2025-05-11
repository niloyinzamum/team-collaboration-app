"use client";

import { useState, useEffect } from 'react';
import { Task } from '../../types/tasks';
import { UserSelect } from '../UserSelect';

interface Member {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  projectId: string;
  onSave: (task: Partial<Task>) => void;
}

export function TaskModal({ isOpen, onClose, task, projectId, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'TODO',
    assignedToId: task?.assignedToId || ''
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      if (!isOpen) return;
      
      setIsFetchingMembers(true);
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsFetchingMembers(false);
      }
    }

    fetchMembers();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="relative z-50 py-8 px-6 max-w-md w-full bg-white/10 rounded-2xl shadow-2xl 
                    backdrop-blur-xl backdrop-filter border border-white/20 hover:border-white/40 
                    transition-all duration-300 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-extrabold text-center text-white mb-5">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...formData, projectId });
          onClose();
        }} className="flex flex-col space-y-6">
          <div>
            <label className="text-white/90 font-semibold mb-2 block" htmlFor="title">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-white/10 border rounded-lg shadow-inner border-white/20 
                       focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40 
                       py-2 px-4 block w-full appearance-none leading-normal text-white 
                       placeholder-white/50"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="text-white/90 font-semibold mb-2 block" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/10 border rounded-lg shadow-inner border-white/20 
                       focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40 
                       py-2 px-4 block w-full appearance-none leading-normal text-white 
                       placeholder-white/50"
              placeholder="Enter task description"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-white/90 font-semibold mb-2 block" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              className="bg-white/10 border rounded-lg shadow-inner border-white/20 
                       focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40 
                       py-2 px-4 block w-full appearance-none leading-normal text-white"
            >
              <option value="TODO" className="text-black">To Do</option>
              <option value="IN_PROGRESS" className="text-black">In Progress</option>
              <option value="COMPLETED" className="text-black">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-white/90 font-semibold mb-2 block">
              Assign To
            </label>
            {isFetchingMembers ? (
              <div className="animate-pulse bg-white/10 h-10 rounded-lg" />
            ) : (
              <UserSelect
                members={members}
                selectedIds={formData.assignedToId ? [formData.assignedToId] : []}
                onChange={(ids) => setFormData({ ...formData, assignedToId: ids[0] })}
                className="bg-white/10 border rounded-lg shadow-inner border-white/20 
                         focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40"
                singleSelect
              />
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                       text-white font-semibold py-2 rounded-lg shadow-lg 
                       hover:from-purple-600/80 hover:to-indigo-600/80 backdrop-blur-sm 
                       transition duration-300 ease-in-out"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 border border-white/20 text-white 
                       font-semibold py-2 rounded-lg shadow-lg hover:bg-white/20 
                       hover:border-white/40 backdrop-blur-sm transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}