"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar width: 256px (w-64) expanded, 80px (w-20) collapsed
  const marginLeft = sidebarOpen ? (collapsed ? "ml-20" : "ml-64") : "ml-0";

  return (
    <div className="bg-gradient-to-r from-blue-300 to-purple-500 min-h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab}
        onTabChange={onTabChange}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`${marginLeft} transition-all duration-300`}>
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}