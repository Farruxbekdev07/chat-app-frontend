"use client";

// packages
import React from "react";

// components
import Sidebar from "src/components/Sidebar";
import ChatWindow from "src/components/ChatWindow";

// styles
import { ChatWrapper } from "src/styles/Chat";
import { SidebarWrapper } from "src/styles/Sidebar";
import DashboardContainer from "src/styles/Dashboard";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <ChatWrapper>
        <ChatWindow />
      </ChatWrapper>
    </DashboardContainer>
  );
};

export default Dashboard;
