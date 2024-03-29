"use client";
import Link from "next/link";
import React from "react";

function DashboardCard({ title, gradient, shadow, text, ...props }) {
  return props.href ? (
    <Link
      onClick={props.href ? null : props.funcion}
      className={`bg-gradient-to-r h-full col-auto outline-none ${gradient} p-3 rounded-lg text-white  hover:${shadow} transition-all active:scale-95 hover:${shadow} ${
        props.currentView === props.idX ? `shadow-xl ${shadow} ` : ""
      }`}
      href={props.href ? props.href : ""}
    >
      <h3 className="text-lg text-left">{title}</h3>
      <div className="text-justify">
        <p className="text-xs">{text}</p>
      </div>
    </Link>
  ) : (
    <button
      onClick={props.funcion}
      className={`bg-gradient-to-r h-full col-auto outline-none ${gradient} p-3 rounded-lg text-white  hover:${shadow} transition-all active:scale-95 hover:${shadow} ${
        props.currentView === props.idX ? `shadow-xl ${shadow} ` : ""
      }`}
    >
      <h3 className="text-lg text-left">{title}</h3>
      <div className="text-justify">
        <p className="text-xs">{text}</p>
      </div>
    </button>
  );
}

export default DashboardCard;
