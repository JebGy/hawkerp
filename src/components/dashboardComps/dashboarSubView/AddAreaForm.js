"use client";
import React, { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";
import { Area } from "@/Classes/Area";
import addAreaImage from "../../../../public/addArea.svg";
import Image from "next/image";

function AddAreaForm({ setReload, reload }) {
  const [error, setError] = useState(false);

  const addArea = async (e) => {
    if (e.target[0].value === "" || e.target[1].value === "") {
      alert("Debes llenar todos los campos");
      setError(true);
      return;
    }
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
      _areaIsEmpty: area.areaIsEmpty,
      _areaPopulation: area.areaPopulation,
      _areaSaturation: area.areaSaturation,
      _tareas: [],
    })
      .then(() => {
        setError(false);
        alert("Área agregada con éxito");
        setReload(!reload);
        e.target[0].value = "";
        e.target[1].value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-row justify-between w-full row-span-3">
      <form
        className="flex flex-col p-5 transition-all h-full w-3/6 "
        onSubmit={(e) => {
          e.preventDefault();
          addArea(e);
        }}
      >
        <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-3">
          Agregar Área
        </h2>
        <div className="flex flex-col justify-center  w-3/6 mx-auto">
          <input
            type="text"
            placeholder="Nombre del Área"
            className={
              error
                ? "mb-5  w-full p-2 outline-none focus:border-b-2 focus:border-red-500"
                : "mb-5  w-full p-2 outline-none focus:border-b-2 focus:border-purple-500"
            }
          />
          <input
            type="number"
            placeholder="Población"
            className="mb-5 w-full p-2 outline-none focus:border-b-2 focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all"
          >
            Agregar
          </button>
        </div>
        
      </form>
      <Image src={addAreaImage} alt="Agregar Área" />
    </div>
  );
}

export default AddAreaForm;
