"use client";
import ThemeHook from "@/Hooks/ThemeHook";
import DashboardBarSide from "@/components/dashboardComps/DashboardBarSide";
import InternFrame from "@/components/dashboardComps/InternFrame";
import React from "react";

/**
 * Wrapper es un componente que se renderiza del lado de cliente para poder hacer uso del hook de Theme
 * @returns Retorna la vista del dashboard
 */
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
