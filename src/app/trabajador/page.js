/* eslint-disable react-hooks/exhaustive-deps */
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
  const [toggleMenu, setToggleMenu] = useState(false);
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
      //sort by id
      querySnapshot.forEach((doc) => {
        console.log(doc.data().time);
        mensajes.push(doc.data());
      });

      setMensajes(
        mensajes.sort((a, b) => {
          return b.time - a.time;
        })
      );
      const notify = localStorage.getItem("notify");
      if (notify) {
        setNewMessages(mensajes.length - notify);
      } else {
        setNewMessages(mensajes.length);
      }
    });
  };

  return (
    <div
      className={
        localStorage.getItem("theme") === "dark"
          ? "bg-zinc-900 p-5 h-screen w-screen flex flex-col justify-between items-center"
          : "p-5 h-screen w-screen flex flex-col justify-between items-center"
      }
    >
      <div className="flex flex-col justify-center w-full">
        <header className="flex flex-row justify-between items-center">
          <h2
            className={
              localStorage.getItem("theme") === "dark"
                ? "font-bold text-lg text-white"
                : "font-bold text-lg"
            }
          >
            Bienvenido, {user ? user.user.split(" ")[0] : null}
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
              className="p-2 rounded-xl border-purple-500 border-2 active:scale-95 transition-all"
              onClick={() => setToggleMenu(!toggleMenu)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-purple-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </button>
          </div>
          {toggleMenu ? (
            <div className={
              localStorage.getItem("theme") === "dark"
                ?"absolute top-0 mt-20 right-0 flex flex-col gap-5 mr-5 bg-zinc-900 p-5 rounded-lg shadow-lg shadow-rose-600"
                :"absolute top-0 mt-20 right-0 flex flex-col gap-5 mr-5 bg-white p-5 rounded-lg shadow-lg shadow-rose-600"
            }>
              <button
                onClick={() => {
                  setOpenNotify(!openNotify);
                  if (openNotify) {
                    localStorage.setItem("notify", mensajes.length);
                    setNewMessages(0);
                  }
                }}
                className=" flex items-center justify-center p-2 rounded-xl border-purple-500 border-2 active:scale-95 transition-all gap-5"
              >
                {newMessages > 0 ? (
                  <div className="flex flex-row gap-2 items-center">
                    <h3 className="text-sm font-semibold text-purple-600">
                      {newMessages}
                    </h3>
                  </div>
                ) : null}
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
                onClick={
                  localStorage.getItem("theme") === "dark"
                    ? () => {
                        localStorage.setItem("theme", "light");
                        window.location.reload();
                      }
                    : () => {
                        localStorage.setItem("theme", "dark");
                        window.location.reload();
                      }
                }
                className="
              flex items-center justify-center p-2 rounded-xl border-purple-500 border-2 active:scale-95 transition-all"
              >
                {localStorage.getItem("theme") === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                )}
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
          ) : null}
          {openNotify ? (
            <div
              className={
                localStorage.getItem("theme") === "dark"
                  ? "absolute top-0 left-0 right-0 bottom-0 my-auto mx-auto lg:mx-auto w-5/6 lg:w-96 h-96 bg-zinc-900 text-white shadow-xl rounded-xl shadow-purple-500 p-5"
                  : "absolute right-0 left-0 top-0 mt-20 lg:mr-5 mx-auto w-5/6 lg:w-96 h-96 bg-zinc-100 shadow-xl rounded-xl shadow-purple-500 p-5"
              }
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
                        className="flex flex-col gap-2 border-b border-neutral-500 pb-2"
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
