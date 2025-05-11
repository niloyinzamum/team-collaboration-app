"use client";

import { useRouter } from 'next/navigation';


interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onNewProject: () => void; // Add this prop
}

export function Sidebar({ 
  isOpen, 
  activeTab, 
  onTabChange, 
  collapsed, 
  setCollapsed,
  onNewProject 
}: SidebarProps) {
  const router = useRouter();
   
  const navItems = [
    { id: 'projects', label: 'Projects' },
    { id: 'messages', label: 'Messages' },
    { id: 'team', label: 'Team' },
    { id: 'files', label: 'Files' }
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:fixed inset-y-0 left-0 z-40 ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300
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
        {/* Update the button to use onNewProject */}
        <div className={`py-8 px-6 border-b border-gray-300/30 ${collapsed ? 'px-2 py-4' : ''}`}>
          {!collapsed && (
            <>
              <h2 className="text-3xl font-extrabold text-indigo-800 mb-5">TeamCollab</h2>
              <button 
                onClick={onNewProject}
                className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 
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
          <button
            onClick={handleLogout}
            className={`w-full mt-2 py-2 px-3 text-gray-700 hover:text-red-600 
              hover:bg-white/30 transition-all rounded-lg flex items-left justify-left gap-2
              ${collapsed ? 'p-2' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </div>
    </div>
  );
}