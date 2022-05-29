import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import Sidebar from "./SideBar";

export default function AppLayout() {
  return (
    <div className="h-screen flex flex-col font-sans">
      <Header />

      <div style={{ height: "calc(100vh - 48px)" }}>
        <div className="flex  w-full h-full max-h-screen	">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
