import React from "react";

function TrabCard({ nombre, texto }) {
  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-300 p-2 rounded-xl text-white h-4/6">
      <h3>{nombre}</h3>
      <p>{texto}</p>
    </div>
  );
}

export default TrabCard;
