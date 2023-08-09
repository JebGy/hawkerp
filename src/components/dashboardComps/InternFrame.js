/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import AddAreaForm from "./dashboarSubView/AddAreaForm";
import AddTaskForm from "./dashboarSubView/AddTaskForm";
import AddTrabajadorForm from "./dashboarSubView/AddTrabajadorForm";
import AddTrabajoForm from "./dashboarSubView/AddTrabajoForm";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";
import AddInventoryForm from "./dashboarSubView/AddInventoryForm";

function InternFrame({ setReload, reload }) {
  const [currentView, setCurrentView] = useState(0);
  const [_user, _setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const db = getFirestore(app);

  const updateArea = (n) => {
    setCurrentView(n);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
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
    <div className="lg:col-span-7 lg:grid lg:grid-rows-6 lg:w-full lg:h-screen grid col-span-7">
      {isLoaded ? (
        <div className="flex flex-flex items-center justify-between p-5 row-span-1">
          <h1 className="text-lg font-bold ">Bienvenido {_user.user}</h1>
          <div className="grid grid-flow-col gap-5 items-center">
            <button
              onClick={() => {
                showForm ? setShowForm(false) : setShowForm(true);
              }}
              className="p-2 rounded-xl border-purple-500 border-2 active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-purple-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                window.location.href = "/trabajador";
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              Mi perfil
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar sesión
            </button>
          </div>
          {showForm ? (
            <div className="absolute z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <button
                onClick={() => {
                  setShowForm(false);
                }}
                className="p-2 z-50 rounded-full bg-red-500 active:scale-95 transition-all duration-150 absolute top-5 right-5 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="bg-white rounded-xl p-5 w-96 ">
                <h1 className="text-2xl text-rose-500 font-bold mb-2 border-b-2 border-rose-500 pb-2">
                  Enviar Mensaje
                </h1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDoc(
                      doc(db, "mensajes", new Date().getTime().toString()),
                      {
                        titulo: e.target[0].value,
                        descrip: e.target[1].value,
                        time: new Date().getTime().toString(),
                      }
                    ).then(() => {
                      alert("Mensaje enviado");
                      setShowForm(false);
                    });
                  }}
                  className="flex flex-col gap-5"
                >
                  <label className="text-lg font-bold">Título</label>
                  <input
                    type="text"
                    className="border-2 border-gray-300 rounded-xl p-2"
                  />
                  <label className="text-lg font-bold">Mensaje</label>
                  <textarea
                    className="border-2 border-gray-300 rounded-xl p-2 h-[12rem] resize-none"
                    rows="2"
                    cols="50"
                  />
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold  py-3 px-4 rounded"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {isLoaded ? (
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5 p-2 row-span-1">
          {_user.access[0] ? (
            <DashboardCard
              idX={0}
              title="Áreas"
              text={
                "Gestiona las áreas de la empresa de manera eficiente. Crea, edita y elimina."
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
                "Gestiona las tareas de la empresa de manera eficiente. Crea, edita y elimina."
              }
              gradient={"from-red-500 to-pink-300"}
              shadow={"shadow-rose-500"}
              funcion={() => {
                updateArea(1);
              }}
              currentView={currentView}
            />
          ) : null}
          {_user.access[2] ? (
            <DashboardCard
              idX={2}
              title="Trabajadores"
              text={
                "Gestiona los trabajadores de la empresa de manera eficiente. Crea, edita y elimina."
              }
              gradient={"from-green-500 to-yellow-300"}
              shadow={"shadow-green-500"}
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
                "Gestiona los trabajos de la empresa de manera eficiente. Crea, edita y elimina."
              }
              gradient={"from-cyan-600 to-emerald-300"}
              shadow={"shadow-cyan-500"}
              funcion={() => {
                updateArea(3);
              }}
              currentView={currentView}
            />
          ) : null}
          {
            <DashboardCard
              idX={4}
              title="Inventario"
              text={
                "Gestiona el inventario de la empresa de manera eficiente. Crea, edita y elimina."
              }
              gradient={"from-rose-500 to-yellow-300"}
              shadow={"shadow-yellow-500"}
              currentView={currentView}
              funcion={() => {
                updateArea(4);
              }}
            />
          }
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
        ) : currentView === 4 ? (
          <AddInventoryForm />
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
