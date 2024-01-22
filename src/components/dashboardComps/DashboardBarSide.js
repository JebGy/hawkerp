"use client";
import { app } from "@/app/firebase/firebaseConf";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import BarSideButtons from "./BarSideButtons";

function DashboardBarSide({ theme, setTheme }) {
  const db = getFirestore(app);
  const [_user, _setUser] = React.useState({
    auth: false,
  });
  const [showForm, setShowForm] = React.useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user === null) {
      window.location.href = "/";
      return;
    }
    _setUser(user);
  }, []);

  return _user.auth ? (
    <div
      className={
        theme === "dark"
          ? "col-span-1 bg-cyan-950  text-white  shadow-xl shadow-zinc-950  h-screen lg:flex flex-col justify-between hidden z-10"
          : "col-span-1  shadow-2xl  h-screen lg:flex flex-col justify-between hidden"
      }
    >
      <div className="flex flex-col p-5 gap-3">
        <p className="text-2xl font-bold text-left mb-5">HAWKERP</p>
        <BarSideButtons
          title="Mi perfil"
          fun={() => {
            window.location.href = "/trabajador";
          }}
          href="/trabajador"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </BarSideButtons>
        <BarSideButtons
          title="Notificar"
          fun={() => {
            setShowForm(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
            />
          </svg>
        </BarSideButtons>
        <BarSideButtons
          title="Tema"
          fun={() => {
            localStorage.setItem(
              "theme",
              localStorage.getItem("theme") === "dark" ? "light" : "dark"
            );
            setTheme(localStorage.getItem("theme"));
          }}
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
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
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          )}
        </BarSideButtons>
        {/* <BarSideButtons title="Config" fun={() => {}}> */}

        <BarSideButtons
          title="Salir"
          fun={() => {
            window.location.href = "/";
            sessionStorage.clear();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </BarSideButtons>
      </div>

      {showForm ? (
        <div className="absolute z-[99] top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center">
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
            className={
              theme === "dark"
                ? "bg-cyan-950 rounded-xl p-5 w-5/6 lg:w-96 "
                : "bg-white rounded-xl p-5 w-5/6 lg:w-96 "
            }
          >
            <h1 className="text-2xl text-rose-500 font-bold mb-2 border-b-2 border-rose-500 pb-2">
              Enviar Mensaje
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDoc(doc(db, "mensajes", new Date().getTime().toString()), {
                  titulo: e.target[0].value,
                  descrip: e.target[1].value,
                  time: new Date().getTime().toString(),
                }).then(() => {
                  alert("Mensaje enviado");
                  setShowForm(false);
                });
              }}
              className="flex flex-col gap-5"
            >
              <label className="text-lg font-bold">Título</label>
              <input
                type="text"
                className="border-2 border-gray-300 rounded-xl p-2 text-black"
              />
              <label className="text-lg font-bold">Mensaje</label>
              <textarea
                className="border-2 border-gray-300 rounded-xl p-2 h-[12rem] resize-none text-black"
                rows="2"
                cols="50"
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold  py-3 px-4 rounded"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  ) : null;
}

export default DashboardBarSide;
