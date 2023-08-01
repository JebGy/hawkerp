"use client";
import React from "react";

function DashboardCard({ title, gradient, shadow,text,...props }) {
  return (
    <button
      onClick={
        props.funcion
      }
      className={`bg-gradient-to-r ${gradient} p-3 rounded-lg text-white hover:shadow-2xl transition-all active:scale-95 hover:${shadow} ${
        props.currentView === props.idX ? `shadow-2xl ${shadow} ` : ""
      }`}
    >
      <h3 className="text-lg text-left">{title}</h3>
      <div className="h-full p-3 text-justify">
        <p className="text-xs">{text}</p>
      </div>
    </button>
  );
}

export default DashboardCard;
