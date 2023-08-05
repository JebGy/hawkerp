"use client";
import React, { useContext, useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";
import { Area } from "@/Classes/Area";
import AreaListItem from "./AreaListItem";

const db = getFirestore(app);

function DashboardAreaList({ reload }) {
  const [areaList, setAreaList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    getAreaList();
  }, [reload]);

  const getAreaList = async () => {
    const querySnapshot = await getDocs(collection(db, "areas"));
    setAreaList([]);
    querySnapshot.forEach((doc) => {
      const area = new Area(
        doc._id,
        doc.data()._areaName,
        doc.data()._areaPopulation,
        doc.data()._areaSaturation,
        doc.data()._areaIsEmpty,
        doc.data()._tareas
      );
      setAreaList((areaList) => [...areaList, area]);
      
    });
    
    setIsLoaded(true);
  };

  return (
    <div className="flex flex-col h-screen w-full p-1 gap-5">
      <h2 className="text-lg p-2 underline underline-offset-8 mb-2">
        Áreas Registradas
      </h2>
      {isLoaded ? (
        areaList.map((area) => {
          sesionStorage.setItem("areaList", JSON.stringify(areaList));
          return (
            <AreaListItem
              areaName={area._areaName}

              key={area._id}
            />
          );
        })
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default DashboardAreaList;
