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
} from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";
import { Area } from "@/Classes/Area";
import addAreaImage from "../../../../public/addArea.svg";
import Image from "next/image";

function AddAreaForm({ setReload, reload }) {
  const db = getFirestore(app);

  const [error, setError] = useState(false);
  const [areas, setAreas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nowEditing, setNowEditing] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState(null);

  const [_areaName, setAreaName] = useState("");
  const [_areaPopulation, setAreaPopulation] = useState(0);

  useEffect(() => {
    loadFromFirebase();
  }, []);

  const loadFromFirebase = async () => {
    await getDocs(collection(db, "areas"))
      .then((querySnapshot) => {
        setAreas(querySnapshot.docs);
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  const addArea = async (e) => {
    if (e.target[0].value === "" || e.target[1].value === "") {
      alert("Debes llenar todos los campos");
      setError(true);
      return;
    }
    if (!nowEditing) {
      const db = getFirestore(app);
      const areasRef = collection(db, "areas");
      const area = new Area(
        "",
        e.target[0].value,
        Number.parseInt(e.target[1].value),
        0,
        true
      );
      await addDoc(areasRef, {
        _areaName: area.areaName,
        _areaPopulation: area.areaPopulation,
        _tareas: [],
      })
        .then(() => {
          setError(false);
          alert("Área agregada con éxito");
          e.target[0].value = "";
          setAreaName("");
          e.target[1].value = 0;
          loadFromFirebase();
        })
        .catch((error) => {
          console.log(error);
        });
      return;
    }
    const db = getFirestore(app);
    const areasRef = collection(db, "areas");
    await updateDoc(doc(areasRef, areaToEdit.id), {
      _areaName: e.target[0].value,
      _areaPopulation: Number.parseInt(e.target[1].value),
    }).then(() => {
      alert("Área editada con éxito");
      e.target[0].value = "";
      setAreaName("");

      e.target[1].value = 0;
      setNowEditing(!nowEditing);
      loadFromFirebase();
    });
  };

  return (
    <div className="grid grid-cols-4 w-full row-span-3 transition-all">
      <form
        className="flex flex-col p-5 transition-all h-full col-span-1"
        onSubmit={(e) => {
          e.preventDefault();
          addArea(e);
        }}
      >
        <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-3">
          Agregar Área
        </h2>
        <div className="flex flex-col justify-center">
          <input
            type="text"
            value={
              nowEditing && areaToEdit !== null
                ? areaToEdit.areaName
                : _areaName
            }
            onChange={
              nowEditing && areaToEdit !== null
                ? (e) => {
                    setAreaToEdit({
                      id: areaToEdit.id,
                      areaName: e.target.value,
                      areaPopulation: areaToEdit.areaPopulation,
                    });
                  }
                : (e) => {
                    setAreaName(e.target.value);
                  }
            }
            placeholder="Nombre del Área"
            className={
              error
                ? "mb-5  w-full p-2 outline-none focus:border-b-2 focus:border-red-500"
                : "mb-5  w-full p-2 outline-none focus:border-b-2 focus:border-purple-500"
            }
          />
          <input
            type="number"
            value={
              nowEditing && areaToEdit !== null
                ? areaToEdit.areaPopulation
                : _areaPopulation
            }
            onChange={
              nowEditing && areaToEdit !== null
                ? (e) => {
                    setAreaToEdit({
                      id: areaToEdit.id,
                      areaName: areaToEdit.areaName,
                      areaPopulation: Number.parseInt(e.target.value),
                    });
                  }
                : (e) => {
                    setAreaPopulation(Number.parseInt(e.target.value));
                  }
            }
            placeholder="Población"
            className="mb-5 w-full p-2 outline-none focus:border-b-2 focus:border-purple-500"
          />

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
      <div className="w-full h-full col-span-3 flex flex-col overflow-hidden p-5">
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
            Áreas registradas
          </h2>
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all active:scale-95 z-50"
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
            // Tareas
            isLoaded ? (
              areas.map((area, index) => {
                return (
                  <div
                    className={
                      nowEditing && areaToEdit.id === area.id
                        ? "w-full flex flex-col justify-start items-start p-3 bg-neutral-100 shadow-lg mb-5 rounded-xl border-2 border-purple-500"
                        : "w-full flex flex-col justify-start items-start p-3 bg-neutral-100 shadow-lg mb-5 rounded-xl "
                    }
                    key={area.id}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="">
                        <h3 className="text-lg font-bold">
                          {area.data()._areaName}
                        </h3>
                        <p className="text-xs">
                          Población: {area.data()._areaPopulation}
                        </p>
                        <p
                          className={
                            area.data()._tareas.length <=
                            area.data()._areaPopulation
                              ? "text-xs text-green-500 font-semibold"
                              : "text-xs text-red-500 font-semibold"
                          }
                        >
                          {area.data()._tareas.length <=
                          area.data()._areaPopulation
                            ? `Área disponible para asignar tareas, tareas actuales ${
                                area.data()._tareas.length
                              }`
                            : `Área saturada, tareas actuales ${
                                area.data()._tareas.length
                              }`}
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <button
                          className="transition-all active:scale-95 hover:shadow-xl hover:shadow-orange-500 p-2 rounded-full"
                          onClick={() => {
                            setAreaToEdit({
                              id: area.id,
                              areaName: area.data()._areaName,
                              areaPopulation: area.data()._areaPopulation,
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
                              //delete area
                              deleteDoc(doc(db, "areas", area.id)).then(() => {
                                alert("Área eliminada con éxito");
                                loadFromFirebase();
                              });
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

export default AddAreaForm;
