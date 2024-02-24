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
import Link from "next/link";

/**
 *
 * @returns Retorna la vista del Trabajador
 */
function page() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [theme, setTheme] = useState("light");
  const db = getFirestore(app);

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setTheme(
      localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );
    if (user === null) {
      window.location.href = "/";
      return;
    } else {
      loadMensajes(user.user);
    }
    setUser(user);
    setIsLoaded(true);
  }, []);

  const loadMensajes = async (user) => {
    const unSub = onSnapshot(collection(db, "mensajes"), (querySnapshot) => {
      const mensajes = [];
      //sort by id
      querySnapshot.forEach((doc) => {
        console.log(doc.data().time);
        if (doc.data().destino == user) {
          mensajes.push(doc.data());
        }
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
        theme === "dark"
          ? "bg-stone-900 p-5 h-screen w-screen flex flex-col justify-between items-center"
          : "p-5 h-screen w-screen flex flex-col justify-between items-center"
      }
    >
      <div className="flex flex-col justify-center w-full">
        <header className="flex flex-row justify-between items-center">
          <h2
            className={
              theme === "dark"
                ? "font-bold text-lg text-white"
                : "font-bold text-lg"
            }
          >
            Bienvenido, {user ? user.user.split(" ")[0] : null}
          </h2>
          <div className="flex flex-row gap-5 items-center">
            {newMessages > 0 ? (
              <div className="flex flex-row gap-2 items-center">
                <h3 className="text-sm font-semibold text-orange-600">
                  {newMessages}
                </h3>
              </div>
            ) : null}
            <button
              className="p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all"
              onClick={() => setToggleMenu(!toggleMenu)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-orange-500"
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
            <div
              className={
                theme === "dark"
                  ? "absolute top-0 mt-20 right-0 flex flex-col gap-5 mr-5 bg-stone-900 p-5 rounded-lg shadow-lg shadow-rose-600"
                  : "absolute top-0 mt-20 right-0 flex flex-col gap-5 mr-5 bg-white p-5 rounded-lg shadow-lg shadow-rose-600"
              }
            >
              <button
                onClick={() => {
                  setOpenNotify(!openNotify);
                  if (openNotify) {
                    localStorage.setItem("notify", mensajes.length);
                    setNewMessages(0);
                  }
                }}
                className=" flex items-center justify-center p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all gap-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-orange-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                  />
                </svg>
              </button>
              {user.rol === "" ? (
                <Link
                  href="/dashboard"
                  className={
                    theme === "dark"
                      ? "flex items-center justify-center p-2 rounded-xl text-orange-500 border-orange-500 border-2 active:scale-95 transition-all"
                      : "flex items-center justify-center p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all"
                  }
                >
                  Dashboard
                </Link>
              ) : null}
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  localStorage.setItem(
                    "theme",
                    theme === "dark" ? "light" : "dark"
                  );
                }}
                className="
              flex items-center justify-center p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all"
              >
                {theme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-orange-500"
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
                    className="w-6 h-6 text-orange-500"
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
                theme === "dark"
                  ? "absolute top-0 left-0 right-0 bottom-0 my-auto mx-auto lg:mx-auto w-5/6 lg:w-96 h-96 bg-stone-900 text-white shadow-xl rounded-xl shadow-orange-500 p-5"
                  : "absolute top-0 left-0 right-0 bottom-0 my-auto mx-auto lg:mx-auto w-5/6 lg:w-96 h-96 bg-white text-black shadow-xl rounded-xl shadow-orange-500 p-5"
              }
            >
              <h3 className="font-bold text-2xl text-orange-600">Hawkmail</h3>
              <div className="flex flex-col gap-5 mt-5 overflow-y-auto h-5/6 p-5">
                {mensajes.length > 0 ? (
                  mensajes.map((mensaje, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-2 border-b-2 border-neutral-500 pb-2"
                      >
                        <h3 className="font-semibold text-lg text-orange-700 underline">
                          Asunto:
                        </h3>
                        <span className="">{mensaje.titulo}</span>
                        <h3 className="font-semibold text-lg text-orange-700 underline">
                          Mensaje:
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
                href="/trabajador/misTareas"
              />
              <DashboardCard
                title="Tareas de área"
                gradient="from-green-500 to-blue-300"
                shadow="from-green-600 to-blue-400"
                text="Gestionar mis tareas de área"
                idX={1}
                currentView={0}
                href="/trabajador/areaTareas"
              />
              <DashboardCard
                title="Generar reporte diario"
                gradient="from-yellow-500 to-green-300"
                shadow="from-yellow-600 to-green-400"
                text="Generar reporte diario de tareas"
                idX={2}
                currentView={0}
                href="/trabajador/reporteDiario"
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
              <h3
                className={
                  theme === "dark" ? "text-white text-lg" : "text-black text-lg"
                }
              >
                Hola {user ? user.user : null}, tu usuario está pendiente de
                aprobación.{" "}
                <a
                  target="_blank"
                  href={`https://wa.me/+51949358892?text=Hola, mi nombre es ${
                    user ? user.user : null
                  }. Requiero autenticar mi cuenta de usuario.`}
                  className="text-orange-600 underline underline-offset-2 cursor-pointer hover:scale-95 active:scale-95 transition-all"
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
