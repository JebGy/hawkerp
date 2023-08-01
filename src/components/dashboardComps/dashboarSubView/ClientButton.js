"use client";
import React from "react";

function ClientButton({ title, func }) {
  return (
    <button
      type="submit"
      className=" p-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      onClick={() => func()}
    >
      {title}
    </button>
  );
}

export default ClientButton;
