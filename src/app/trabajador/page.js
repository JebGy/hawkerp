/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import DashboardCard from "@/components/dashboardComps/DashboardCard";
import React, { useState } from "react";
import tareasImage from "../../../public/tareas.svg";
import Image from "next/image";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../firebase/firebaseConf";

function page() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const db = getFirestore(app);

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user === null) {
      window.location.href = "/";
      return;
    }
    loadMensajes();
    setUser(user);
    setIsLoaded(true);
  }, []);

  const loadMensajes = async () => {
    const unSub = onSnapshot(collection(db, "mensajes"), (querySnapshot) => {
      const mensajes = [];
      querySnapshot.forEach((doc) => {
        mensajes.push(doc.data());
      });
      setMensajes(mensajes);
      const notify = localStorage.getItem("notify");
      if (notify) {
        setNewMessages(mensajes.length - notify);
      } else {
        setNewMessages(mensajes.length);
      }
    });
  };

  return (
    <div className="p-5 h-screen w-screen flex flex-col justify-between items-center">
      <div className="flex flex-col justify-center w-full">
        <header className="flex flex-row justify-between items-center">
          <h2 className="font-bold text-xl">
            Bienvenido, {user ? user.user : null}
          </h2>
          <div className="flex flex-row gap-5 items-center">
            {newMessages > 0 ? (
              <div className="flex flex-row gap-2 items-center">
                <h3 className="text-sm font-semibold text-purple-600">
                  {newMessages}
                </h3>
              </div>
            ) : null}
            <button
              onClick={() => {
                setOpenNotify(!openNotify);
                if (openNotify) {
                  localStorage.setItem("notify", mensajes.length);
                  setNewMessages(0);
                }
              }}
              className="p-2 rounded-xl border-purple-500 border-2 active:scale-95 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-purple-500 hover:text-purple-600 cursor-pointer  transition-all"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
            <button
              className="bg-red-500 text-white rounded-md p-2"
              onClick={() => {
                sessionStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Cerrar sesión
            </button>
          </div>
          {openNotify ? (
            <div className="absolute right-0 left-0 top-0 mt-16 lg:mr-5 mx-auto w-96 h-96 bg-neutral-100 shadow-xl rounded-xl shadow-purple-500 p-5"
              
            >
              <h3 className="font-bold text-xl text-purple-600">
                Notificaciones
              </h3>
              <div className="flex flex-col gap-5 mt-5 overflow-y-auto h-5/6 p-5">
                {mensajes.length > 0 ? (
                  mensajes.map((mensaje, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-2 border-b border-neutral-200 pb-2"
                      >
                        <h3 className="font-semibold text-lg">
                          {mensaje.titulo}
                        </h3>
                        <p className="text-sm text-justify">
                          {mensaje.descrip}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <h3 className="text-lg">No hay notificaciones</h3>
                )}
              </div>
            </div>
          ) : null}
        </header>
        <div className="flex flex-col">
          {isLoaded && user.auth ? (
            <div className="grid grid-row lg:grid-cols-4 gap-5 mt-5">
              <DashboardCard
                title="Tareas Individuales"
                gradient="from-red-500 to-pink-300"
                shadow="from-red-600 to-pink-400"
                text="Gestionar mis tareas individuales."
                idX={0}
                currentView={1}
                funcion={() => (window.location.href = "/trabajador/misTareas")}
              />
              <DashboardCard
                title="Tareas de área"
                gradient="from-green-500 to-blue-300"
                shadow="from-green-600 to-blue-400"
                text="Gestionar mis tareas de área"
                idX={1}
                currentView={0}
                funcion={() =>
                  (window.location.href = "/trabajador/areaTareas")
                }
              />
              <DashboardCard
                title="Generar reporte diario"
                gradient="from-yellow-500 to-green-300"
                shadow="from-yellow-600 to-green-400"
                text="Generar reporte diario de tareas"
                idX={2}
                currentView={0}
                funcion={() =>
                  (window.location.href = "/trabajador/reporteDiario")
                }
              />
              <DashboardCard
                title="Proximamente"
                gradient="from-orange-500 to-yellow-300"
                shadow="from-yellow-600 to-green-400"
                text="Funcionalidades próximas"
                idX={3}
                currentView={0}
                funcion={() =>
                  alert("Esta funcionalidad aún no está disponible.")
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5 mt-5">
              <h3 className="text-lg">
                Hola {user ? user.user : null}, tu usuario está pendiente de
                aprobación.{" "}
                <a
                  target="_blank"
                  href={`https://wa.me/+51949358892?text=Hola, mi nombre es ${
                    user ? user.user : null
                  }. Requiero autenticar mi cuenta de usuario.`}
                  className="text-purple-600 underline underline-offset-2 cursor-pointer hover:scale-95 active:scale-95 transition-all"
                >
                  {" "}
                  Comunícate con el departamento de TI{" "}
                </a>{" "}
                {"  "} para autenticar tu cuenta. Gracias.
              </h3>
            </div>
          )}
        </div>
      </div>
      <Image src={tareasImage} alt="tareas" height={300} />
    </div>
  );
}

export default page;
