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
          ? "bg-stone-900 text-white h-screen overflow-y-auto"
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
                className="flex lg:flex-row flex-col justify-center lg:justify-between items-center border-b-2 border-gray-200 mb-5 p-5 max-w-full"
              >
                <div className="flex flex-col">
                  <h2 className="font-bold lg:text-start text-justify p-4 text-2xl w-96 overflow-x-auto">
                    {tarea._taskName}
                  </h2>
                  <h2 className=" lg:text-start text-justify p-4 text-xl w-96 overflow-x-auto">
                    {tarea._taskDescription}
                  </h2>
                  <h2 className=" lg:text-start text-justify p-4 text-xl w-96 overflow-x-auto">
                    Responsable: <span className="text-yellow-600 font-bold">{tarea._worker}</span>
                  </h2>
                </div>
                <button
                  className={
                    tarea._taskIsDone
                      ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                      : "bg-orange-950 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                  }
                  onClick={async () => {
                    await updateDoc(doc(db, "areas", tarea._taskId), {
                      _tareas: arrayRemove({
                        _taskId: tarea._taskId,
                        _taskName: tarea._taskName,
                        _taskDescription: tarea._taskDescription,
                        _worker: tarea._worker,
                        _taskIsDone: tarea._taskIsDone,
                      }),
                    });

                    await updateDoc(doc(db, "areas", tarea._taskId), {
                      _tareas: arrayUnion({
                        _taskId: tarea._taskId,
                        _taskName: tarea._taskName,
                        _taskDescription: tarea._taskDescription,
                        _worker: tarea._worker,
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

    </div>
  );
}

export default AreaTareas;
