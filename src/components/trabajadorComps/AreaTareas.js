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
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect } from "react";

function AreaTareas() {
  const [user, setUser] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [tareas, setTareas] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  const db = getFirestore(app);

  useEffect(() => {
    const _user = JSON.parse(sessionStorage.getItem("user"));
    setTheme(
      localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );
    if (_user === null) {
      window.location.href = "/";
      return;
    }
    setUser(_user);
    getTareas(_user);
  }, [openModal]);

  const getTareas = async (_user) => {
    await getDocs(collection(db, "areas")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data()._areaName === _user.area) {
          setTareas(doc.data()._tareas);
          setIsLoaded(true);
        }
      });
    });
  };
  return (
    <div
      className={
        theme === "dark"
          ? "bg-zinc-900 text-white h-full"
          : "bg-gray-100 text-gray-900 h-full"
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
              <h1 className="text-xl font-bold">Tareas de {user.area}</h1>
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
                    {tarea._taskName}
                  </h2>
                </div>
                <button
                  className={
                    tarea._taskIsDone
                      ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                      : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                  }
                  onClick={async () => {
                    await updateDoc(doc(db, "areas", tarea._taskId), {
                      _tareas: arrayRemove({
                        _taskName: tarea._taskName,
                        _taskId: tarea._taskId,
                        _taskIsDone: false,
                      }),
                    });

                    await updateDoc(doc(db, "areas", tarea._taskId), {
                      _tareas: arrayUnion({
                        _taskName: tarea._taskName,
                        _taskId: tarea._taskId,
                        _taskIsDone: true,
                      }),
                    }).then(() => {
                      getTareas(user);
                    });
                  }}
                >
                  {tarea._taskIsDone ? "Completada" : "Completar"}
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
              className="flex flex-col justify-center items-center w-full py-5 rounded-lg bg-white px-10"
              onSubmit={async (e) => {
                e.preventDefault();
                const nombre = e.target[0].value;
                await updateDoc(doc(db, "usuarios", user.user), {
                  _tareas: arrayUnion({
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
                className="w-full h-10 px-3 mb-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Descripción de la tarea"
                className="w-full h-20 px-3 mb-5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
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

export default AreaTareas;
