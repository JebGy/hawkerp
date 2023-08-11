"use client";
import ThemeHook from "@/Hooks/ThemeHook";
import DashboardBarSide from "@/components/dashboardComps/DashboardBarSide";
import InternFrame from "@/components/dashboardComps/InternFrame";
import React from "react";

function Wrapper() {
  const { theme, setTheme } = ThemeHook();
  return (
    <div className="grid grid-cols-7">
      <DashboardBarSide theme={theme} setTheme={setTheme} />
      <InternFrame theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default Wrapper;
