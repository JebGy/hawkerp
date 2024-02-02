/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { app } from "@/app/firebase/firebaseConf";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect } from "react";

function MisTareasForm() {
  const [user, setUser] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [tareas, setTareas] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  const db = getFirestore(app);

  useEffect(() => {
    const _user = JSON.parse(sessionStorage.getItem("user"));
    setTheme(localStorage.getItem("theme")? localStorage.getItem("theme") : "light");
    if (_user === null) {
      window.location.href = "/";
      return;
    }
    setUser(_user);
    getTareas(_user);
  }, [openModal]);

  const getTareas = async (_user) => {
    await getDoc(doc(db, "usuarios", _user.user)).then((doc) => {
      if (doc.exists()) {
        setTareas(doc.data().tareas);
        setIsLoaded(true);
      }
    });
  };
  return (
    <div
      className={
        theme === "dark"
          ? "bg-stone-900 text-white h-screen"
          : "bg-gray-100 text-gray-900 h-screen"
      }
    >
      {isLoaded ? (
        <div className="p-5 ">
          <div className="flex flex-row justify-between items-center mb-5 ">
            <div className="flex flex-row justify-center items-center gap-5">
              <Link href="/trabajador">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={4}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold">Mis Tareas</h1>
            </div>
            <div className="flex flex-row gap-5 justify-center items-center">
              <button
                className=""
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={4}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-500 active:scale-90 transition duration-150"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      "¿Estás seguro de eliminar las tareas completadas?"
                    )
                  ) {
                    tareas.forEach(async (tarea) => {
                      if (tarea.estado) {
                        await updateDoc(doc(db, "usuarios", user.user), {
                          tareas: arrayRemove({
                            nombre: tarea.nombre,
                            descripcion: tarea.descripcion,
                            estado: true,
                          }),
                        }).then(() => {
                          getTareas(user);
                        });
                      }
                    });
                    alert("Tareas eliminadas");
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-red-500 hover:text-red-700 active:scale-90 transition duration-150"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
          {tareas.map((tarea, index) => {
            return (
              <div
                key={index}
                className="flex flex-row justify-between items-center border-b-2 border-gray-200 mb-5 p-5 max-w-full"
              >
                <div className="flex flex-col ">
                  <h2 className="font-bold text-xl w-32 overflow-x-auto">
                    {tarea.nombre}
                  </h2>
                  <p className="text-gray-500 w-32">{tarea.descripcion}</p>
                </div>
                <button
                  className={
                    tarea.estado
                      ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                      : "bg-orange-950 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                  }
                  onClick={async () => {
                    await updateDoc(doc(db, "usuarios", user.user), {
                      tareas: arrayRemove({
                        nombre: tarea.nombre,
                        descripcion: tarea.descripcion,
                        estado: false,
                      }),
                    });

                    await updateDoc(doc(db, "usuarios", user.user), {
                      tareas: arrayUnion({
                        nombre: tarea.nombre,
                        descripcion: tarea.descripcion,
                        estado: true,
                      }),
                    }).then(() => {
                      getTareas(user);
                    });
                  }}
                >
                  {tarea.estado ? "Completada" : "Completar"}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {openModal ? (
        <div className="fixed z-10 inset-0 overflow-y-auto w-screen h-screen bg-black bg-opacity-70 p-5">
          <button
            onClick={() => setOpenModal(false)}
            className="p-2 z-50 rounded-full bg-red-500 active:scale-95 transition-all duration-150 absolute top-5 right-5 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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

          <div className="flex flex-col justify-center items-center w-full h-full">
            <form
              className={
                theme === "dark"
                  ? "flex flex-col justify-center items-center w-full lg:w-4/6 py-5 rounded-lg bg-stone-900 px-10"
                  : "flex flex-col justify-center items-center w-full lg:w-4/6 py-5 rounded-lg bg-white px-10"
              }
              onSubmit={async (e) => {
                e.preventDefault();
                const nombre = e.target[0].value;
                await updateDoc(doc(db, "usuarios", user.user), {
                  tareas: arrayUnion({
                    nombre: nombre,
                    descripcion: e.target[1].value,
                    estado: false,
                  }),
                });
                setOpenModal(false);
              }}
            >
              <h1 className="text-3xl font-bold mb-5">Nueva Tarea</h1>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                className="w-full h-10 px-3 mb-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-950"
              />
              <textarea
                placeholder="Descripción de la tarea"
                className="w-full h-20 p-3 mb-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-950"
              />
              <button
                type="submit"
                className="bg-orange-950 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
              >
                Agregar
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MisTareasForm;
