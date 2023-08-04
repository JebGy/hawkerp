/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import AddAreaForm from "./dashboarSubView/AddAreaForm";
import AddTaskForm from "./dashboarSubView/AddTaskForm";
import AddTrabajadorForm from "./dashboarSubView/AddTrabajadorForm";
import AddTrabajoForm from "./dashboarSubView/AddTrabajoForm";

function InternFrame({ setReload, reload }) {
  const [currentView, setCurrentView] = useState(0);
  const [_user, _setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  let windowWidth = 0;

  const updateArea = (n) => {
    setCurrentView(n);
  };

  useEffect(() => {
    windowWidth = window.innerWidth;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
      if (user.rol === "1") {
        window.location.href = "/trabajador";
        return;
      }
    }
    if (user === null) {
      window.location.href = "/";
      return;
    }
    _setUser(user);

    setIsLoaded(true);
  }, []);

  return (
    <div className="lg:col-span-6 lg:grid lg:grid-rows-4 lg:w-full lg:h-screen grid col-span-7">
      {windowWidth < 1024 && isLoaded ? (
        <div className="flex flex-flex items-center justify-between p-5">
          <h1 className="text-2xl font-bold ">Bienvenido {_user.user}</h1>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      ) : null}
      {isLoaded ? (
        <div className="grid lg:grid-flow-col grid-col-2 grid-flow-row gap-5 p-2">
          {_user.access[0] ? (
            <DashboardCard
              idX={0}
              title="Áreas"
              text={
                "Gestiona las áreas de la empresa de manera eficiente. Crea, edita y elimina áreas."
              }
              gradient={"from-purple-500 to-cyan-300"}
              shadow={"shadow-purple-500"}
              funcion={() => {
                updateArea(0);
              }}
              currentView={currentView}
            />
          ) : null}
          {_user.access[1] ? (
            <DashboardCard
              idX={1}
              title="Tareas"
              text={
                "Gestiona las tareas de la empresa de manera eficiente. Crea, edita y elimina tareas."
              }
              gradient={"from-red-500 to-pink-300"}
              shadow={"shadow-purple-500"}
              funcion={() => {
                updateArea(1);
              }}
              currentView={currentView}
            />
          ) : null}
          {_user.access[2] ? (
            <DashboardCard
              idX={2}
              title="Usuarios/Trabajadores"
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
          ) : null}
          {_user.access[3] ? (
            <DashboardCard
              idX={3}
              title="Trabajos"
              text={
                "Gestiona los trabajos de la empresa de manera eficiente. Crea, edita y elimina tareas."
              }
              gradient={"from-cyan-500 to-emerald-300"}
              shadow={"shadow-purple-500"}
              funcion={() => {
                updateArea(3);
              }}
              currentView={currentView}
            />
          ) : null}
        </div>
      ) : null}
      {isLoaded ? (
        currentView === 0 && _user.access[0] ? (
          <AddAreaForm setReload={setReload} reload={reload} />
        ) : currentView === 1 && _user.access[1] ? (
          <AddTaskForm />
        ) : currentView === 2 && _user.access[2] ? (
          <AddTrabajadorForm />
        ) : currentView === 3 && _user.access[3] ? (
          <AddTrabajoForm />
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-5">Bienvenido {_user.user}</h1>
            <p className="text-xl mt-5">
              No tienes permitido realizar acciones en este sistema. <br />
              <a
                target="_blank"
                href={`https://wa.me/+51949358892?text=Hola, mi nombre es ${_user.user} y necesito activación de permisos en el sistema.`}
                className="text-purple-600 underline underline-offset-2 cursor-pointer hover:scale-95 active:scale-95 transition-all"
              >
                {" "}
                Comunícate con el departamento de TI{" "}
              </a>{" "}
              {"  "} para actualizar sus permisos. <br />
              Gracias.
            </p>
          </div>
        )
      ) : null}
    </div>
  );
}

export default InternFrame;
