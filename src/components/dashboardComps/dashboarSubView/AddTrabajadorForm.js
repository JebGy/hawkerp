"use client";
import { app } from "@/app/firebase/firebaseConf";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
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
  const [openModal, setOpenModal] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [load, setLoad] = useState(false);
  const [canSeeReportes, setCanSeeReportes] = useState(false);
  const [reportTosee, setReportTosee] = useState("");

  const [_trabajadorName, set_trabajadorName] = useState("");
  const [_trabajadorLastName, set_trabajadorLastName] = useState(0);
  const [_trabajadorArea, set_trabajadorArea] = useState("");

  useEffect(() => {
    loadFromFirebase();
  }, []);

  const getReportes = async (id) => {
    let today =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate();
    await getDocs(
      query(collection(db, `usuarios/${trabajadorEdit.id}/reportes`)),
      orderBy("fecha", "asc")
    )
      .then((querySnapshot) => {
        if (
          querySnapshot.docs.some((doc) => {
            return doc.id === today;
          })
        ) {
          console.log("si");
        } else {
          console.log("no");
        }

        setReportes(
          querySnapshot.docs.sort((a, b) => {
            if (a.id > b.id) {
              return -1;
            }
            if (a.id < b.id) {
              return 1;
            }
            return 0;
          })
        );
      })
      .then(() => {
        setLoad(true);
      });
  };

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
    await getDocs(collection(db, "usuarios"))
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
    if (nowEdit) {
      const trabRef = doc(db, "usuarios", trabajadorEdit.id);
      console.log(trabajadorEdit);
      await updateDoc(trabRef, {
        ...trabajadorEdit,
        auth: trabajadorEdit.auth === "1" ? true : false,
        area: trabajadorEdit.area,
      }).then(() => {
        alert("Trabajador editado con éxito");
        setNowEdit(false);
      });
      loadFromFirebase();
    }
  };

  nowEdit ? () => {} : null;

  return (
    <div className="grid grid-cols-4 p-5 row-span-3  w-full h-full">
      <div className="col-span-1 h-full">
        <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
          Editar usuarios
        </h2>

        <div className="grid grid-cols-2 gap-5 p-5">
          <form
            onSubmit={(e) => {
              addTrabajador(e);
            }}
            className="col-span-2"
          >
            <select
              value={
                nowEdit
                  ? trabajadorEdit.auth
                    ? "1"
                    : "0"
                  : _trabajadorLastName
              }
              onChange={
                nowEdit
                  ? (e) => {
                      setTrabajadorEdit({
                        ...trabajadorEdit,
                        auth: e.target.value,
                      });
                    }
                  : (e) => {
                      set_trabajadorLastName(e.target.value);
                    }
              }
              className="outline-none mb-5 p-2 w-full focus:border-b-2 focus:border-purple-500 transition-all"
            >
              <option value={"1"}>Autenticado</option>
              <option value={"0"}>No Autenticado</option>
            </select>

            <select
              value={nowEdit ? trabajadorEdit._trabajadorArea : _trabajadorArea}
              onChange={
                nowEdit
                  ? (e) => {
                      setTrabajadorEdit({
                        ...trabajadorEdit,
                        area: e.target.value,
                      });
                    }
                  : (e) => {
                      set_trabajadorArea(e.target.value);
                    }
              }
              className="underline underline-offset-4 p-4 outline-none w-full focus:border-b-2 focus:border-purple-500 transition-all mb-5 cursor-pointer"
            >
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
              {nowEdit ? "Editar" : "Selecciona un usuario porfavor"}
            </button>
          </form>
        </div>
      </div>

      <div className="col-span-3 w-full h-full">
        <table className="w-full">
          <thead className="">
            <tr className="border-b-2 border-b-purple-500">
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Usuario
              </th>
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Auth
              </th>
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Área
              </th>
              <th className="p-2 text-xs font-semibold text-center text-zinc-900">
                Detalles
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
                      {trabajador.data().user}
                    </td>
                    <td
                      className={
                        trabajador.data().auth
                          ? "p-2 text-xs font-semibold text-center  text-green-500"
                          : "p-2 text-xs font-semibold text-center text-red-500"
                      }
                    >
                      {trabajador.data().auth
                        ? "Autenticado"
                        : "No Autenticado"}
                    </td>
                    <td className="p-2 text-xs font-semibold text-center text-zinc-900">
                      {trabajador.data().area}
                    </td>
                    <td className="text-xs font-semibold text-center text-zinc-900">
                      <button
                        className="border-2 w-10 rounded-lg border-purple-500 p-2"
                        onClick={() => {
                          setTrabajadorEdit({
                            ...trabajador.data(),
                          });
                          getReportes(trabajador.id);
                          setOpenModal(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6 text-purple-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="p-2 text-xs font-semibold text-center text-zinc-900 flex flex-row gap-3 justify-center">
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                        onClick={() => {
                          setTrabajadorEdit({
                            ...trabajador.data(),
                            id: trabajador.id,
                          });
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
                              doc(db, "usuarios", trabajador.id)
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

      {openModal ? (
        <div className="fixed z-10 inset-0 overflow-y-auto w-screen h-screen bg-black bg-opacity-70 p-5">
          <button
            onClick={() => {
              setLoad(false);
              setOpenModal(false);
              setReportes([]);
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
          <div className="grid grid-cols-2  h-full bg-white rounded-xl w-5/6 mx-auto p-5 overflow-y-auto">
            <div className="p-5">
              <h2 className="text-3xl font-bold mb-5">
                Tareas de {trabajadorEdit.user}
              </h2>
              {isLoaded && trabajadorEdit.tareas ? (
                trabajadorEdit.tareas.map((tarea) => {
                  return (
                    <div
                      className="flex flex-row justify-between items-center p-5 w-full border-b-purple-500 border-b-2"
                      key={tarea.nombre}
                    >
                      <div className="flex flex-col ">
                        <h1 className="text-md font-bold mb-5">
                          {tarea.nombre}
                        </h1>
                        <p className="text-md">{tarea.descripcion}</p>
                      </div>
                      <h2
                        className={
                          tarea.estado
                            ? "text-green-500 text-md font-bold"
                            : "text-red-500 text-md font-bold"
                        }
                      >
                        {tarea.estado ? "Completada" : "Pendiente"}
                      </h2>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <h1 className="text-3xl font-bold mb-5">Cargando...</h1>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-3xl font-bold mb-5 ">
                  Reportes de {trabajadorEdit.id}
                </h2>
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold p-2 rounded-full transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                  onClick={() => {
                    getReportes(trabajadorEdit.id);
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
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              </div>
              <div>
                {load ? (
                  reportes.map((reporte) => {
                    return (
                      <div
                        className="flex flex-row justify-between items-center p-5 w-full border-b-purple-500 border-b-2"
                        key={reporte.id}
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row justify-between items-center">
                            <h1 className="text-xl font-bold mb-5">
                              {reporte.id}
                            </h1>
                            <button
                              className="bg-purple-500 hover:bg-purple-600 text-white font-bold p-2 rounded-full transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                              onClick={() => {
                                setReportTosee(reporte.id);
                                setCanSeeReportes(!canSeeReportes);
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
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </button>
                          </div>
                          {canSeeReportes && reportTosee === reporte.id ? (
                            <div className="flex flex-col gap-5">
                              {reporte.data().lista.map((tarea) => {
                                return (
                                  <div
                                    className="flex flex-row justify-between items-center p-2 w-full border-b-purple-500 border-b-2"
                                    key={tarea}
                                  >
                                    <p>{tarea}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h1 className="text-3xl font-bold mb-5">No hay reportes</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
