import { projects } from '@/data/mockData';

export function StatsSection() {
  const stats = [
    { title: 'ACTIVE PROJECTS', count: projects.length, change: '+2 this month' },
    { title: 'TEAM MEMBERS', count: 16, change: '+3 new members' },
    { title: 'SHARED FILES', count: 128, change: '23 uploaded this week' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/20 backdrop-blur-xl backdrop-filter 
          rounded-lg p-6 border border-white/20">
          <h3 className="text-sm font-medium text-black/70 mb-4">{stat.title}</h3>
          <p className="text-3xl font-bold text-black mb-2">{stat.count}</p>
          <p className="text-sm text-green-300">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}