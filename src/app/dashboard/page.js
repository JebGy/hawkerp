"use client";
import DashboardAreaList from "@/components/dashboardComps/DashboardAreaList";
import InternFrame from "@/components/dashboardComps/InternFrame";
import React, { useState } from "react";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [reload, setReload] = useState(false);
  return (
    <div className="grid grid-cols-5">
      
      <InternFrame setReload={setReload} reload={reload}/>
    </div>
  );
}
