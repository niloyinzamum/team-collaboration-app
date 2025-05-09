interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isOpen, activeTab, onTabChange, collapsed, setCollapsed }: SidebarProps) {
  const navItems = [
    { id: 'projects', label: 'Projects' },
    { id: 'messages', label: 'Messages' },
    { id: 'team', label: 'Team' },
    { id: 'files', label: 'Files' }
  ];

  return (
    <div className={`${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed lg:fixed inset-y-0 left-0 z-40 ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300
    bg-white/20 bg-opacity-30 shadow-lg backdrop-blur-xl backdrop-filter h-screen`}>
      <div className="flex flex-col h-full">
        {/* Collapse Button */}
        <button
          className="absolute top-4 right-[-16px] bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-indigo-600 transition"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <span>&#9654;</span>
          ) : (
            <span>&#9664;</span>
          )}
        </button>

        {/* Header */}
        <div className={`py-8 px-6 border-b border-gray-300/30 ${collapsed ? 'px-2 py-4' : ''}`}>
          {!collapsed && (
            <>
              <h2 className="text-3xl font-extrabold text-indigo-800 mb-5">TeamCollab</h2>
              <button className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 
                text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-lg 
                transition duration-300 ease-in-out">
                New Project
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-6 space-y-4 ${collapsed ? 'p-2 space-y-2' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0 py-2' : 'text-left px-4 py-3'} rounded-lg transition duration-300 ease-in-out
                bg-transparent border ${activeTab === item.id 
                  ? 'border-indigo-500 text-black-800 shadow-md' 
                  : 'border-gray-300 text-gray-700 hover:border-indigo-500'} 
                focus:ring-2 focus:ring-indigo-200`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`font-semibold ${collapsed ? 'sr-only' : ''}`}>{item.label}</span>
              {collapsed && (
                <span className="material-icons" aria-hidden="true">
                  {/* Optionally add icons here */}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`px-6 py-4 border-t border-gray-300/30 ${collapsed ? 'px-2 py-2' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} bg-white/20 p-3 rounded-lg`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 shadow-md"></div>
            {!collapsed && (
              <div>
                <p className="text-gray-800 font-semibold">Alex Morgan</p>
                <p className="text-gray-700 text-sm">Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}