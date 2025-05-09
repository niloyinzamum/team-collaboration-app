import { recentMessages } from '@/data/mockData';

export function MessagesSection() {
  return (
    <div className="bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-6 
      border border-white/20">
      <h2 className="text-lg font-semibold text-black mb-6">Recent Messages</h2>
      <div className="space-y-4">
        {recentMessages.map(msg => (
          <div key={msg.id} className="flex items-start p-3 bg-white/10 rounded-lg 
            hover:bg-white/20 transition duration-300 cursor-pointer">
            <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full" />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-black text-sm">{msg.user}</p>
                <span className="text-xs text-black/70">{msg.time}</span>
              </div>
              <p className="text-sm text-black/80 truncate">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full text-center text-sm text-black/80 hover:text-black 
        font-medium mt-4 transition-colors">
        View All Messages
      </button>
    </div>
  );
}