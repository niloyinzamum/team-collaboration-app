"use client";

import { useState, useEffect } from 'react';
import { UserSelect } from '../UserSelect';

interface Member {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberIds: [] as string[]
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          description: '',
          memberIds: []
        });
        onClose();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 backdrop-blur-md" 
           onClick={onClose}>
      </div>
      
      <div className="relative z-50 py-8 px-6 max-w-md w-full bg-white/10 rounded-2xl shadow-2xl 
                      backdrop-blur-xl backdrop-filter border border-white/20 hover:border-white/40 
                      transition-all duration-300 overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-extrabold text-center text-white mb-5">
          Create New Project
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label className="text-white/90 font-semibold mb-2 block" htmlFor="name">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/10 border rounded-lg shadow-inner border-white/20 
                         focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40 
                         py-2 px-4 block w-full appearance-none leading-normal text-white 
                         placeholder-white/50"
              placeholder="Enter project name"
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
              placeholder="Enter project description"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-white/90 font-semibold mb-2 block">
              Project Members
            </label>
            {isFetchingMembers ? (
              <div className="animate-pulse bg-white/10 h-10 rounded-lg" />
            ) : (
              <UserSelect
                members={members}
                selectedIds={formData.memberIds}
                onChange={(ids) => setFormData({ ...formData, memberIds: ids })}
                className="bg-white/10 border rounded-lg shadow-inner border-white/20 
                           focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40"
              />
            )}
            <p className="text-white/60 text-sm mt-1">
              Select team members to add to this project
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                         text-white font-semibold py-2 rounded-lg shadow-lg 
                         hover:from-purple-600/80 hover:to-indigo-600/80 backdrop-blur-sm 
                         transition duration-300 ease-in-out disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
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