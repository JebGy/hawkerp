/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import AddAreaForm from "./dashboarSubView/AddAreaForm";
import AddTaskForm from "./dashboarSubView/AddTaskForm";
import AddTrabajadorForm from "./dashboarSubView/AddTrabajadorForm";
import AddTrabajoForm from "./dashboarSubView/AddTrabajoForm";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import { app, deleteFile } from "@/app/firebase/firebaseConf";
import AddInventoryForm from "./dashboarSubView/AddInventoryForm";
import ThemeHook from "@/Hooks/ThemeHook";
import Link from "next/link";

function InternFrame({ setReload, reload, theme, setTheme }) {
  const [currentView, setCurrentView] = useState(0);
  const [_user, _setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSelecctor, setShowSelector] = useState(false);
  const [userList, setUserList] = useState([]);
  const db = getFirestore(app);

  const updateArea = (n) => {
    setCurrentView(n);
  };
  const getUsers = async () => {
    const ref = collection(db, "usuarios");
    const q = query(ref);
    const snapshot = await getDocs(q);
    const provList = [];
    snapshot.forEach((user) => {
      provList.push(user.id);
    });
    setUserList(provList);
  };

  useEffect(() => {
    /*  const daysOfThisWeek = () => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const lunes = new Date(today.setDate(diff));
      const domingo = new Date(today.setDate(diff + 6));
      return [lunes, domingo];
    };

    if (
      daysOfThisWeek()[1].getDate() === new Date().getDate() &&
      daysOfThisWeek()[1].getMonth() === new Date().getMonth() &&
      daysOfThisWeek()[1].getFullYear() === new Date().getFullYear()
    ) {
      console.log(
        "Si es Domingo " +
          daysOfThisWeek()[0].getDate() +
          " " +
          (new Date().getMonth() + 1) +
          " " +
          new Date().getFullYear()
      );
      const deleteAll = async () => {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        querySnapshot.forEach((doc) => {
          getDocs(collection(db, `usuarios/${doc.id}/reportes`)).then(
            (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
              });
            }
          );
        });
      };
      deleteAll();
    } else {

      console.log(
        "No es Domingo " +
          daysOfThisWeek()[1].getDate() +
          " " +
          (new Date().getMonth() + 1) +
          " " +
          new Date().getFullYear()
      );
    } */

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
    } else {
    }
    _setUser(user);
    getUsers();
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={
        theme === "dark"
          ? "lg:col-span-6 lg:grid lg:grid-rows-6 lg:w-full lg:h-screen grid col-span-7 bg-stone-900 text-white "
          : "lg:col-span-6 lg:grid lg:grid-rows-6 lg:w-full lg:h-screen grid col-span-7 "
      }
    >
      {isLoaded ? (
        <div className="flex flex-flex items-center justify-between p-5 row-span-1 lg:hidden  ">
          <h1 className="text-lg font-bold ">Bienvenido {_user.user}</h1>
          <div className="grid grid-flow-col gap-5 items-center ">
            <button
              onClick={() => {
                showSelecctor ? setShowSelector(false) : setShowSelector(true);
              }}
              className="p-2 rounded-xl border-orange-500 border-2  lg:hidden md:hidden active:scale-95 transition-all"
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
            <button
              onClick={() => {
                showForm ? setShowForm(false) : setShowForm(true);
              }}
              className="p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all hidden lg:block md:block"
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
                  d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                />
              </svg>
            </button>

            {showSelecctor ? (
              <div
                className={
                  theme === "dark"
                    ? "absolute w-fit flex flex-col p-5 gap-5 bg-stone-900 shadow-xl shadow-rose-500 top-0  mt-20  right-0  rounded-lg lg:hidden md:hidden"
                    : "absolute w-fit flex flex-col p-5 gap-5 bg-white shadow-xl shadow-rose-500 top-0  mt-20  right-0  rounded-lg lg:hidden md:hidden"
                }
              >
                <button
                  onClick={() => {
                    showForm ? setShowForm(false) : setShowForm(true);
                  }}
                  className="p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all flex items-center justify-center"
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
                      d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    theme === "dark" ? setTheme("light") : setTheme("dark");
                    localStorage.setItem(
                      "theme",
                      theme === "dark" ? "light" : "dark"
                    );
                  }}
                  className="flex items-center justify-center p-2 rounded-xl border-orange-500 border-2 active:scale-95 transition-all"
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
                <Link
                  href={"/trabajador"}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded "
                >
                  Mi perfil
                </Link>
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
            ) : null}
          </div>
          {showForm ? (
            <div className="fixed bg-black bg-opacity-50 z-50 top-0 left-0 w-screen h-screen flex flex-col items-center justify-center ">
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

              <div
                className={`${
                  theme === "dark" ? "bg-stone-900" : "bg-white"
                }  w-5/6 rounded-xl p-5`}
              >
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
                        destino: e.target[1].value,
                        descrip: e.target[2].value,
                        time: new Date().getTime().toString(),
                      }
                    ).then(() => {
                      alert("Mensaje enviado");
                      setShowForm(false);
                    });
                  }}
                  className="grid grid-cols-5 gap-5"
                >
                  <div className="flex flex-col col-span-1 gap-4">
                    <label className="lg:text-lg font-bold h-8">Título</label>
                    <label className="lg:text-lg font-bold h-8">Destino</label>
                    <label className="lg:text-lg font-bold">Mensaje</label>
                  </div>
                  <div className="col-span-1 lg:hidden"></div>

                  <div className="flex flex-col lg:col-span-4 col-span-3 gap-4">
                    <input
                      type="text"
                      className="border-2 h-8 w-full border-gray-300 rounded-xl p-2 text-black"
                    />
                    <select className="h-8 w-full text-black">
                      {userList.map((u, i) => {
                        return (
                          <option value={u} key={i} className="text-black p-1">
                            {u}
                          </option>
                        );
                      })}
                    </select>
                    <textarea
                      className="border-2  border-gray-300 rounded-xl p-2 h-[12rem] resize-none text-black"
                      rows="2"
                      cols="50"
                    />
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 w-full text-white font-bold  py-3 px-4 rounded col-span-2"
                    >
                      Enviar
                    </button>
                  </div>
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
              gradient={"from-orange-500 to-orange-950"}
              shadow={"shadow-orange-500"}
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
              gradient={"from-red-500 to-red-950"}
              shadow={"shadow-red-500"}
              funcion={() => {
                updateArea(1);
              }}
              currentView={currentView}
            />
          ) : null}
          {_user.access[2] ? (
            <DashboardCard
              idX={2}
              title="Colaboradores"
              text={
                "Gestiona los colaboradores de la empresa de manera eficiente. Crea, edita y elimina."
              }
              gradient={"from-yellow-500 to-yellow-950"}
              shadow={"shadow-yellow-500"}
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
              gradient={"from-emerald-500 to-emerald-950"}
              shadow={"shadow-emerald-500"}
              funcion={() => {
                updateArea(3);
              }}
              currentView={currentView}
            />
          ) : null}
          {_user.access[4] ? (
            <DashboardCard
              idX={4}
              title="Inventario"
              text={
                "Gestiona el inventario de la empresa de manera eficiente. Crea, edita y elimina."
              }
              gradient={"from-pink-500 to-pink-950"}
              shadow={"shadow-pink-500"}
              currentView={currentView}
              funcion={() => {
                updateArea(4);
              }}
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
        ) : currentView === 4 && _user.access[4] ? (
          <AddInventoryForm />
        ) : (
          <div className="h-screen p-5">
            <h1 className="text-2xl font-bold mb-5">Bienvenido {_user.user}</h1>
            <p className="text-xl mt-5">
              No tienes permitido realizar acciones en este sistema. <br />
              <a
                target="_blank"
                href={`https://wa.me/+51949358892?text=Hola, mi nombre es ${_user.user} y necesito activación de permisos en el sistema.`}
                className="text-orange-500 underline underline-offset-2 cursor-pointer hover:scale-95 active:scale-95 transition-all"
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
