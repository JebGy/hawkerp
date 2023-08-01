"use client";
import React from "react";

function AreaListItem({ areaName, areaId }) {
  return (
    <div
      className="bg-neutral-100 shadow-lg w-full p-3 flex flex-row justify-between items-center rounded-2xl"
      key={areaId}
    >
      <h3 className="text-xs">{areaName}</h3>
      <button className="ml-2 text-sm text-neutral-950">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}

export default AreaListItem;
