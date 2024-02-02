/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { app } from "@/app/firebase/firebaseConf";
import { createReportHtml } from "@/app/service/FileExport";
import ReportItem from "@/components/trabajadorComps/ReportItem";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";

/**
 * 
 * @returns Retorna la vista de los reportes del trabajador
 */
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
  const [provitionaList, setProvitionaList] = useState([]);
  const [selector, setSelector] = useState(false);
  // Agrega este estado al comienzo de tu componente
  const [newTasksCountForButton, setNewTasksCountForButton] = useState(0);

  useEffect(() => {
    loadFromFirebase();
  }, []);

  useEffect(() => {
    if (trabajadorEdit.id && openModal) {
      getReportes(trabajadorEdit.id);
    }
  }, [trabajadorEdit]);

  /**
   * Obtiene los reportes del trabajador
   * @param {*} id 
   */
  const getReportes = async (id) => {
    let today =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate();

    const unsuscribe = onSnapshot(
      query(collection(db, `usuarios/${id}/reportes`), orderBy("fecha", "asc")),
      (querySnapshot) => {
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
      }
    );
  };

  /**
   * Carga los datos de firebase
   */
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
    });
    await getDocs(collection(db, "usuarios"))
      .then((querySnapshot) => {
        setTrabajadores(querySnapshot.docs);
        setProvitionaList(querySnapshot.docs);
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  /**
   * Agrega un trabajador
   * @param {*} e 
   */
  const addTrabajador = async (e) => {
    //add trabajador
    e.preventDefault();
    if (nowEdit) {
      const trabRef = doc(db, "usuarios", trabajadorEdit.id);
      trabajadorEdit;
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

  return (
    <div className="grid grid-cols-4  p-5 row-span-5  w-full h-full">
      <div className="col-span-full lg:col-span-1 h-full">
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
              className="outline-none mb-5 p-2 w-full bg-transparent focus:border-b-2 focus:border-orange-500 transition-all"
            >
              <option className="text-black" value={"1"}>
                Autenticado
              </option>
              <option className="text-black" value={"0"}>
                No Autenticado
              </option>
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
              className="underline underline-offset-4 bg-transparent p-4 outline-none w-full focus:border-b-2 focus:border-orange-500 transition-all mb-5 cursor-pointer"
            >
              {isLoaded ? (
                areas.map((area) => {
                  return (
                    <option className="text-black" key={area.id}>
                      {area.data()._areaName}
                    </option>
                  );
                })
              ) : (
                <option>Cargando...</option>
              )}
            </select>
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-orange-500 transition-all active:scale-95"
              >
                {nowEdit ? "Editar" : "Selecciona un usuario porfavor"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <table className="flex flex-col col-span-full lg:col-span-3 row-span-5 w-full  overflow-x-auto">
        <thead className="grid grid-cols-1 ">
          <tr className="border-2 border-orange-500 grid grid-cols-5 items-center">
            <th className="p-2 text-xs font-semibold text-center">Usuario</th>
            <th className="p-2 text-xs font-semibold text-center">Auth</th>
            <th className="p-2 text-xs font-semibold text-center">
              <select
                onChange={(e) => {
                  if (e.target.value === "Todas las áreas") {
                    setTrabajadores(provitionaList);
                    return;
                  }
                  setTrabajadores(
                    provitionaList.filter((trab) => {
                      return trab.data().area === e.target.value;
                    })
                  );
                }}
                className="rounded-lg p-1 border-2 border-orange-500 bg-transparent w-full focus:border-orange-500 transition-all"
              >
                <option className="text-black">Todas las áreas</option>
                {areas.map((area) => {
                  return (
                    <option className="text-black" key={area.id}>
                      {area.data()._areaName}
                    </option>
                  );
                })}
              </select>
            </th>
            <th className="p-2 text-xs font-semibold text-center">Detalles</th>
            <th className="p-2 text-xs font-semibold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className=" overflow-y-auto  w-full col-span-full lg:grid lg:grid-cols-1">
          {isLoaded ? (
            trabajadores.map((trabajador) => {
              return (
                <tr
                  key={trabajador.id}
                  className={
                    trabajadorEdit.id === trabajador.id && nowEdit
                      ? "border-b-2 border-b-orange-500 items-center bg-orange-600 bg-opacity-20 lg:grid lg:grid-cols-5 gap-5 h-fit"
                      : "border-b-2 border-b-orange-500 items-center lg:grid lg:grid-cols-5 gap-5 h-fit"
                  }
                >
                  <td className="p-2 text-xs font-semibold text-center ">
                    {trabajador.data().user}
                  </td>
                  <td
                    className={
                      trabajador.data().auth
                        ? "p-2 text-xs font-semibold text-center  text-green-500"
                        : "p-2 text-xs font-semibold text-center text-red-500"
                    }
                  >
                    {trabajador.data().auth ? "Autenticado" : "No Autenticado"}
                  </td>
                  <td className="p-2 text-xs font-semibold text-center ">
                    {trabajador.data().area}
                  </td>
                  <td className="text-xs font-semibold text-center ">
                    <button
                      className="border-2 rounded-lg border-orange-500 p-2"
                      onClick={() => {
                        setTrabajadorEdit({
                          ...trabajador.data(),
                        });
                        getReportes(trabajador.id);
                        setOpenModal(true);
                        setLoad(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-500"
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
                  <td className="p-2 text-xs font-semibold text-center  flex flex-row gap-3 justify-center">
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
            <tr className="border-b-2 border-b-orange-500">
              <td className="p-2 text-xs font-semibold text-center text-zinc-900">
                Cargando...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {openModal ? (
        <div className="fixed z-10 inset-0 overflow-hidden w-screen h-screen bg-black bg-opacity-70 p-5">
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
          <div
            className={
              localStorage.getItem("theme") === "dark"
                ? "grid grid-rows-1 lg:grid-cols-1 bg-stone-900 lg:grid-rows-1 h-full  rounded-xl w-full lg:w-4/6 mx-auto p-5 overflow-y-auto"
                : "grid grid-rows-1 lg:grid-cols-1 bg-white lg:grid-rows-1 h-full  rounded-xl w-full lg:w-4/6 mx-auto p-5 overflow-y-auto"
            }
          >
            <div className="p-2">
              <div className="flex flex-row justify-between items-center mb-5 gap-5">
                <h2 className="text-xl font-bold ">
                  Reportes de {trabajadorEdit.id}
                </h2>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 rounded-full transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
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
              <div className="flex flex-col gap-5 h-[90%] overflow-y-auto">
                {load ? (
                  reportes.map((reporte) => {
                    return (
                      <div
                        className="flex flex-row justify-between items-center p-5 w-full border-b-orange-500 border-b-2 mb-5"
                        key={reporte.id}
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row justify-between items-center mb-6">
                            <h1
                              className={
                                reporte.data().lista.length < 1
                                  ? "text-red-500 text-md font-bold"
                                  : "text-green-500 text-md font-bold"
                              }
                            >
                              {reporte.id}
                            </h1>
                            <div className="flex flex-row items-center justify-center gap-5">
                              <button
                                onClick={() => {
                                  createReportHtml(
                                    reporte.data(),
                                    trabajadorEdit
                                  ).then((e) => {
                                    alert(
                                      "Reporte descargado. Para imprimirlo, abra el archivo descargado y presione Ctrl+P"
                                    );
                                  });
                                }}
                                className="bg-zinc-500 p-2 rounded-full bg-opacity-20 active:scale-95 transition-all"
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
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                  />
                                </svg>
                              </button>
                              <button
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 rounded-full transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                                onClick={() => {
                                  setReportTosee(reporte.id);
                                  setCanSeeReportes(!canSeeReportes);
                                  console.log(reporte.id);
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
                          </div>
                          {localStorage.setItem(
                            "reporte",
                            JSON.stringify(reporte.data().lista.length)
                          )}
                          {canSeeReportes && reportTosee === reporte.id ? (
                            <div className="flex flex-col h-full gap-5 ">
                              {
                                // if reporte change tis length notify the user

                                reporte.data().lista.length < 1 ? (
                                  <h1 className="text-2xl font-bold mb-5">
                                    No hay reportes
                                  </h1>
                                ) : null
                              }
                              {reporte.data().lista.map((tarea) => {
                                return (
                                  <ReportItem
                                    url={tarea.imagenurl ? tarea.imagenurl : ""}
                                    key={
                                      tarea.actividad ? tarea.actividad : tarea
                                    }
                                    actividad={
                                      tarea.actividad ? tarea.actividad : tarea
                                    }
                                    hora={tarea.hora ? tarea.hora : ""}
                                  />
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

      {
        <div
          className={
            selector
              ? "flex flex-col gap-2 absolute mt-80 lg:mt-0 lg:right-0 h-fit p-5 rounded-xl w-96 bg-slate-50 shadow-xl shadow-rose-500"
              : "hidden"
          }
        >
          {areas.map((area) => {
            return (
              <button
                key={area.id}
                onClick={() => {
                  let sub = trabajadores.filter((trabajador) => {
                    return trabajador.data().area === area.data()._areaName;
                  });
                  setTrabajadores(sub);
                }}
                className=" bg-rose-500 p-2 rounded-lg text-white hover:bg-rose-600 transition-all active:scale-95"
              >
                {area.data()._areaName}
              </button>
            );
          })}
        </div>
      }
    </div>
  );
}
