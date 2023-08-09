/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";

function AddInventoryForm({ ...porps }) {
  const db = getFirestore(app);
  const [inventory, setInventory] = useState([]);
  const [nowEdit, setNowEdit] = useState(false);
  const [nowExtract, setNowExtract] = useState(false);

  const getInventory = async () => {
    const unSuscribeInventory = onSnapshot(
      collection(db, "inventario"),
      (snapshot) => {
        const inventoryData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventory(inventoryData);
      }
    );
    return unSuscribeInventory;
  };

  useEffect(() => {
    getInventory();
  }, []);

  const addInventory = async (e) => {
    e.preventDefault();
    const inventoryRef = doc(db, "inventario", e.target[0].value);
    const inventoryData = {
      cantidad: e.target[1].value,
      extraidoPor: "no",
      fechaDeIngreso: new Date().toLocaleDateString(),
    };
    await setDoc(inventoryRef, inventoryData).then(() => {
      console.log("Document successfully written!");
    });
  };

  return (
    <div className="grid grid-cols-4 w-full row-span-4 transition-all">
      <div className="col-span-1">
        <form
          onSubmit={(e) => {
            addInventory(e);
          }}
          className="flex flex-col w-full p-5 gap-5"
        >
          <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
            Agregar producto
          </h2>
          <input
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="Nombre del producto"
          />
          <input
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400"
            type="number"
            placeholder="Cantidad del producto"
          />
          <button className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all active:scale-95">
            Agregar
          </button>
        </form>
      </div>
      <div className="col-span-3 mt-5">
        <table className="flex flex-col col-span-full lg:col-span-3 row-span-5 w-full  overflow-x-auto text-center">
          <thead className="grid grid-cols-1 ">
            <tr className="border-2 border-purple-500 grid grid-cols-5 items-center p-2">
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Extraido por</th>
              <th>Fecha de ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="grid grid-cols-1">
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-2 border-purple-500 grid grid-cols-5 items-center justify-center p-2"
              >
                <td>{item.id}</td>
                <td>{item.cantidad}</td>
                <td>{item.extraidoPor}</td>
                <td>{item.fechaDeIngreso}</td>
                <td className="flex flex-row justify-evenly">
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                    onClick={() => {
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
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                    onClick={() => {
                      setNowExtract(!nowExtract);
                    }}
                  >
                    {!nowExtract ? (
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
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
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
                          "¿Estás seguro de que quieres eliminar este item?"
                        )
                      ) {
                        await deleteDoc(doc(db, "inventario", item.id)).then(
                          () => {
                            alert("Producto removido exitosamente");
                          }
                        );
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddInventoryForm;
