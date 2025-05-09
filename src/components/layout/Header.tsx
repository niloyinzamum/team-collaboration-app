interface DashboardHeaderProps {
    onMenuClick: () => void;
  }
  
  export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    return (
      <header className="bg-white/20 bg-opacity-30 shadow-lg backdrop-blur-xl backdrop-filter border-b border-white/30">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg bg-white bg-opacity-30 shadow-lg backdrop-blur-xl"
          >
            <span>Menu</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border rounded-lg shadow border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-4 block w-full appearance-none leading-normal"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }