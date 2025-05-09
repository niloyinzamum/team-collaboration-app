import { projects } from '@/data/mockData';

interface ProjectsSectionProps {
  className?: string;
}

export function ProjectsSection({ className = '' }: ProjectsSectionProps) {
  return (
    <div className={`bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-6 
      border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Active Projects</h2>
        <button className="text-black/80 hover:text-black transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="flex items-center justify-between p-4 
            bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 cursor-pointer">
            <div>
              <h3 className="font-medium text-black">{project.name}</h3>
              <div className="flex items-center mt-1 text-black/70 text-sm">
                <span>{project.members} members</span>
              </div>
            </div>
            {project.unread > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-red-400/20 
                text-red-100 rounded-full">
                {project.unread} new
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}