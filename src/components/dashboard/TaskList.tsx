import { Task } from '../../types/tasks';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface TaskListProps {
  projectId: string;
  onTaskClick: (task: Task) => void;
  onNewTask: () => void;
}

export function TaskList({ projectId, onTaskClick, onNewTask }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Tasks ({tasks.length})</h3>
        <button
          onClick={onNewTask}
          className="px-3 py-1 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                     text-white rounded-lg text-sm hover:from-purple-600/80 
                     hover:to-indigo-600/80 transition-all duration-300"
        >
          New Task
        </button>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-black/50">
            No tasks created yet
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="p-4 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 
                         transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{task.title}</h4>
                <div className="flex items-center gap-2">
                  {task.assignedTo && (
                    <div className="flex items-center gap-1">
                      <Image
                        src={task.assignedTo.image || '/default-avatar.png'}
                        alt={task.assignedTo.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-xs text-black/70">{task.assignedTo.name}</span>
                    </div>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-black/70 mt-1">{task.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}