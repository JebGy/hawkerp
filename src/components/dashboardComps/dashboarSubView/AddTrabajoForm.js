/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";

/**
 *
 * @param {*} param0
 * @returns Retorna el formulario para agregar un trabajo
 */
function AddTrabajoForm({ setReload, reload }) {
  const db = getFirestore(app);

  const [error, setError] = useState(false);
  const [trabajos, settrabajos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nowEditing, setNowEditing] = useState(false);
  const [trabajoToEdit, settrabajoToEdit] = useState(null);

  const [_trabajoEncargado, set_trabajoEncargado] = useState("");
  const [_trabajoFecha, set_trabajoFecha] = useState("");
  const [_trabajoDescripcion, set_trabajoDescripcion] = useState("");
  const [_trabajoEstado, set_trabajoEstado] = useState("");

  useEffect(() => {
    loadFromFirebase();
  }, []);

  /**
   * Cargo los trabajos desde firebase
   */
  const loadFromFirebase = async () => {
    await getDocs(query(collection(db, "trabajos"), orderBy("_trabajoFecha")))
      .then((querySnapshot) => {
        settrabajos(querySnapshot.docs);
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  /**
   * Agrego un trabajo a firebase
   * @param {*} e
   * @returns nada
   */
  const addtrabajo = async (e) => {
    if (e.target[0].value === "" || e.target[1].value === "") {
      alert("Debes llenar todos los campos");
      setError(true);
      return;
    }
    if (!nowEditing) {
      const db = getFirestore(app);
      const trabajosRef = collection(db, "trabajos");
      await addDoc(trabajosRef, {
        _trabajoEncargado: e.target[0].value,
        _trabajoFecha: e.target[1].value,
        _trabajoDescripcion: e.target[2].value,
        _trabajoEstado: e.target[3].value,
      })
        .then(() => {
          setError(false);
          setIsLoaded(false);
          loadFromFirebase();
          alert("Área agregada con éxito");
          e.target[0].value = "";
          e.target[1].value = "";
          e.target[2].value = "";
        })
        .catch((error) => {
          error;
        });
      return;
    }
    const db = getFirestore(app);
    const trabajosRef = collection(db, "trabajos");
    await updateDoc(doc(trabajosRef, trabajoToEdit.id), {
      _trabajoEncargado: e.target[0].value,
      _trabajoFecha: e.target[1].value,
      _trabajoDescripcion: e.target[2].value,
      _trabajoEstado: e.target[3].value,
    }).then(() => {
      alert("Área editada con éxito");
      e.target[0].value = "";
      e.target[1].value = "";
      e.target[2].value = "";
      setNowEditing(!nowEditing);
      loadFromFirebase();
    });
  };

  return (
    <div className="grid grid-cols-4  w-full row-span-5 transition-all">
      <form
        className="flex flex-col p-5 transition-all h-full col-span-full lg:col-span-1"
        onSubmit={(e) => {
          e.preventDefault();
          addtrabajo(e);
        }}
      >
        <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-3">
          Agregar Trabajo
        </h2>
        <div className="flex flex-col justify-center ">
          <input
            type="text"
            required
            value={
              nowEditing ? trabajoToEdit._trabajoEncargado : _trabajoEncargado
            }
            onChange={
              nowEditing
                ? (e) => {
                    settrabajoToEdit({
                      ...trabajoToEdit,
                      _trabajoEncargado: e.target.value,
                    });
                  }
                : (e) => {
                    set_trabajoEncargado(e.target.value);
                  }
            }
            placeholder="Encargado por"
            className={
              error
                ? "mb-5  w-full p-2 outline-none text-black focus:border-b-2 focus:border-red-500 border-2 border-gray-300 rounded-lg"
                : "mb-5  w-full p-2 outline-none text-black focus:border-b-2 focus:border-purple-500 border-2 border-gray-300 rounded-lg"
            }
          />
          <input
            type="date"
            required
            value={nowEditing ? trabajoToEdit._trabajoFecha : _trabajoFecha}
            onChange={
              nowEditing
                ? (e) => {
                    settrabajoToEdit({
                      ...trabajoToEdit,
                      _trabajoFecha: e.target.value,
                    });
                  }
                : (e) => {
                    set_trabajoFecha(e.target.value);
                  }
            }
            placeholder="Fecha de entrega"
            className="mb-5 w-full p-2 outline-none text-black focus:border-b-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
          />
          <textarea
            placeholder="Descripción . . ."
            required
            value={nowEditing ? trabajoToEdit._trabajoDescripcion : null}
            onChange={
              nowEditing
                ? (e) => {
                    settrabajoToEdit({
                      ...trabajoToEdit,
                      _trabajoDescripcion: e.target.value,
                    });
                  }
                : (e) => {
                    set_trabajoDescripcion(e.target.value);
                  }
            }
            className="mb-5 w-full p-2 outline-none text-black focus:border-b-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
          />
          <select
            className="mb-5 w-full bg-transparent  p-2 outline-none focus:border-b-2 focus:border-purple-500"
            name="estado"
            id="estado"
          >
            <option className="text-black" value="Pendiente">
              Pendiente
            </option>
            <option className="text-black" value="En proceso">
              En proceso
            </option>
            <option className="text-black" value="Terminado">
              Terminado
            </option>
          </select>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all"
          >
            {
              // eslint-disable-next-line no-nested-ternary
              nowEditing ? "Editar" : error ? "Error" : "Agregar"
            }
          </button>
        </div>
      </form>
      <div className="w-full h-full col-span-full lg:col-span-3 flex flex-col overflow-hidden p-5">
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
            Trabajos Registrados
          </h2>
          <button
            className=" bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-full p-2 hover:shadow-xl hover:shadow-cyan-300 transition-all active:scale-95 z-1"
            onClick={() => {
              setIsLoaded(false);
              loadFromFirebase();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
        <div className="w-full h-full flex flex-col overflow-y-auto">
          {
            // Ttrabajos
            isLoaded ? (
              trabajos.map((trabajo, index) => {
                return (
                  <div
                    className={
                      nowEditing && trabajoToEdit.id === trabajo.id
                        ? "w-full flex flex-col justify-start items-start p-3 text-black bg-neutral-100 shadow-lg mb-5 rounded-xl border-2 border-purple-500"
                        : "w-full flex flex-col justify-start items-start p-3 text-black bg-neutral-100 shadow-lg mb-5 rounded-xl "
                    }
                    key={trabajo.id}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col justify-start items-start">
                        <h2 className="text-lg font-semibold">
                          {trabajo.data()._trabajoEncargado}
                        </h2>
                        <p className="text-sm">
                          Entregar: {trabajo.data()._trabajoFecha}
                        </p>
                        <p className="text-sm">
                          {trabajo.data()._trabajoDescripcion}
                        </p>
                        <p
                          className={
                            "text-sm font-bold" +
                            (trabajo.data()._trabajoEstado === "Pendiente"
                              ? " text-red-500"
                              : trabajo.data()._trabajoEstado === "En proceso"
                              ? " text-yellow-500"
                              : " text-green-500")
                          }
                        >
                          Estado: {trabajo.data()._trabajoEstado}
                        </p>
                      </div>

                      <div className="flex flex-row gap-2">
                        <button
                          className="transition-all active:scale-95 hover:shadow-xl hover:shadow-orange-500 p-2 rounded-full"
                          onClick={() => {
                            settrabajoToEdit({
                              id: trabajo.id,
                              _trabajoEncargado:
                                trabajo.data()._trabajoEncargado,
                              _trabajoFecha: trabajo.data()._trabajoFecha,
                              _trabajoDescripcion:
                                trabajo.data()._trabajoDescripcion,
                              _trabajoEstado: trabajo.data()._trabajoEstado,
                            });
                            setNowEditing(!nowEditing);
                          }}
                        >
                          {!nowEditing ? (
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
                          className="transition-all active:scale-95 hover:shadow-xl hover:shadow-red-500 p-2 rounded-full"
                          onClick={() => {
                            //ask for confirmation
                            if (
                              window.confirm(
                                "¿Estás seguro de que quieres eliminar esta área? Esta acción no se puede deshacer."
                              )
                            ) {
                              //delete trabajo
                              deleteDoc(doc(db, "trabajos", trabajo.id)).then(
                                () => {
                                  alert("Área eliminada con éxito");
                                  loadFromFirebase();
                                }
                              );
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-red-500"
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
                  </div>
                );
              })
            ) : (
              <p>Cargando...</p>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default AddTrabajoForm;
