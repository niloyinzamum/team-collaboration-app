"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { ProjectsSection } from "@/components/dashboard/ProjectsSection";
import { MessagesSection } from "@/components/dashboard/MessagesSection";
import { FilesSection } from "@/components/dashboard/FilesSection";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-8">
        <WelcomeSection />
        <StatsSection />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ProjectsSection className="lg:col-span-2" />
          <div className="lg:col-span-1 space-y-8">
            <MessagesSection />
            <FilesSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}