"use client";
import { app } from "@/app/firebase/firebaseConf";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function AddTrabajadorForm() {
  const db = getFirestore(app);
  const [areas, setAreas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [nowEdit, setNowEdit] = useState(false);
  const [trabajadorEdit, setTrabajadorEdit] = useState({});

  useEffect(() => {
    loadFromFirebase();
  }, []);

  const loadFromFirebase = async () => {
    await getDocs(collection(db, "areas")).then((querySnapshot) => {
      setAreas(querySnapshot.docs);
      //add task list
      let _taskList = [];
      querySnapshot.docs.forEach((doc) => {
        doc.data()._tareas.forEach((task) => {
          _taskList.push(task);
        });
      });
      console.log(querySnapshot.docs);
    });
    await getDocs(collection(db, "trabajadores"))
      .then((querySnapshot) => {
        setTrabajadores(querySnapshot.docs);
        console.log(querySnapshot.docs);
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  const addTrabajador = async (e) => {
    //add trabajador
    e.preventDefault();
    if (!nowEdit) {
      const trabRef = collection(db, "trabajadores");
      await addDoc(trabRef, {
        _trabajadorName: e.target[0].value,
        _trabajadorLastName: e.target[1].value,
        _trabajadorArea: e.target[2].value,
      }).then(() => {
        alert("Trabajador agregado con éxito");
        e.target[0].value = "";
        e.target[1].value = "";
      });
      loadFromFirebase();
      return;
    }
    //edit trabajador

    const trabRef = doc(db, "trabajadores", trabajadorEdit.id);
    await updateDoc(trabRef, {
      _trabajadorName: e.target[0].value,
      _trabajadorLastName: e.target[1].value,
      _trabajadorArea: e.target[2].value,
    }).then(() => {
      alert("Trabajador editado con éxito");
      e.target[0].value = "";
      e.target[1].value = "";
      setNowEdit(false);
    });
    loadFromFirebase();
  };

  nowEdit ? () => {} : null;

  return (
    <div className="grid grid-cols-4 p-5 row-span-3  w-full h-full">
      <div className="col-span-1 h-full">
        <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
          Agregar Trabajador
        </h2>

        <div className="grid grid-cols-2 gap-5 p-5">
          <form
            onSubmit={(e) => {
              addTrabajador(e);
            }}
            className="col-span-2"
          >
            <input
              className="outline-none mb-5 p-2 w-full focus:border-b-2 focus:border-purple-500 transition-all"
              placeholder="Nombre"
            />
            <input
              className="outline-none mb-5 p-2 w-full focus:border-b-2 focus:border-purple-500 transition-all"
              placeholder="Apellido"
            />
            <select className="underline underline-offset-4 p-4 outline-none w-full focus:border-b-2 focus:border-purple-500 transition-all mb-5 cursor-pointer">
              {isLoaded ? (
                areas.map((area) => {
                  return <option key={area.id}>{area.data()._areaName}</option>;
                })
              ) : (
                <option>Cargando...</option>
              )}
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all active:scale-95"
            >
              {nowEdit ? "Editar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>

      <div className="col-span-3 w-full h-full">
        <table className="w-full">
          <thead className="">
            <tr className="border-b-2 border-b-purple-500">
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Nombre
              </th>
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Apellido
              </th>
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Área
              </th>
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-center h-full overflow-y-auto">
            {isLoaded ? (
              trabajadores.map((trabajador) => {
                return (
                  <tr
                    key={trabajador.id}
                    className={
                      trabajadorEdit.id === trabajador.id && nowEdit
                        ? "border-b-2 border-b-purple-500 bg-purple-200"
                        : "border-b-2 border-b-purple-500"
                    }
                  >
                    <td className="p-2 text-xs font-semibold text-center text-zinc-900">
                      {trabajador.data()._trabajadorName}
                    </td>
                    <td className="p-2 text-xs font-semibold text-center text-zinc-900">
                      {trabajador.data()._trabajadorLastName}
                    </td>
                    <td className="p-2 text-xs font-semibold text-center text-zinc-900">
                      {trabajador.data()._trabajadorArea}
                    </td>
                    <td className="p-2 text-xs font-semibold text-center text-zinc-900 flex flex-row gap-3 justify-center">
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                        onClick={() => {
                          setTrabajadorEdit(trabajador);
                          setNowEdit(!nowEdit);
                        }}
                      >
                        {!nowEdit ? (
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "¿Estás seguro de que quieres eliminar este trabajador?"
                            )
                          ) {
                            await deleteDoc(
                              doc(db, "trabajadores", trabajador.id)
                            ).then(() => {
                              alert("Trabajador eliminado con éxito");
                              loadFromFirebase();
                            });
                          }
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
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b-2 border-b-purple-500">
                <td className="p-2 text-xs font-semibold text-center text-zinc-900">
                  Cargando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
