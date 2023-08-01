"use client";
import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import AddAreaForm from "./dashboarSubView/AddAreaForm";
import AddTaskForm from "./dashboarSubView/AddTaskForm";

function InternFrame({ setReload ,reload }) {
  const [currentView, setCurrentView] = useState(0);

  const updateArea = (n) => {
    setCurrentView(n);
  };

  return (
    <div className="col-span-full grid grid-rows-4 w-full h-screen">
      <div className="grid grid-cols-3 gap-5 p-2 row-span-1">
        <DashboardCard
          idX={0}
          title="Áreas"
          text={
            "Gestiona las áreas de la empresa de manera eficiente. Crea, edita y elimina áreas."
          }
          gradient={"from-purple-500 to-blue-400"}
          shadow={"shadow-purple-500"}
          funcion={() => {
            updateArea(0);
          }}
          currentView={currentView}
        />
        <DashboardCard
          idX={1}
          title="Tareas"
          text={
            "Gestiona las tareas de la empresa de manera eficiente. Crea, edita y elimina tareas."
          }
          gradient={"from-red-500 to-pink-400"}
          shadow={"shadow-purple-500"}
          funcion={() => {
            updateArea(1);
          }}
          currentView={currentView}
        />
        <DashboardCard
          idX={2}
          title="Trabajadores"
          text={
            "Gestiona los trabajadores de la empresa de manera eficiente. Crea, edita y elimina tareas."
          }
          gradient={"from-purple-500 to-pink-300"}
          shadow={"shadow-purple-500"}
          funcion={() => {
            updateArea(2);
          }}
          currentView={currentView}
        />
      </div>
      {currentView === 0 ? (
        <AddAreaForm setReload={setReload} reload={reload}/>
      ) : currentView === 1 ? (
        <AddTaskForm />
      ) : currentView === 2 ? (
        <div></div>
      ) : null}
    </div>
  );
}

export default InternFrame;
