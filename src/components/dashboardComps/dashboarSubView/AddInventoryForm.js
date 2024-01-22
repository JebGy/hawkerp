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
  addDoc,
} from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";
import { excelReader } from "@/app/service/ExcelReader";

/**
 * 
 * @param {*} param0 
 * @returns Retorna la vista del formulario de agregar inventario
 */
function AddInventoryForm({ ...porps }) {
  const db = getFirestore(app);
  const [inventory, setInventory] = useState([]);
  const [filtredInventory, setFiltredInventory] = useState([]);
  const [nowEdit, setNowEdit] = useState(false);
  const [nowExtract, setNowExtract] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [currentItem, setCurrentItem] = useState("");

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");

  const getInventory = async () => {
    const unSuscribeInventory = onSnapshot(
      collection(db, "inventario"),
      (snapshot) => {
        const inventoryData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const inventoryDataSorted = inventoryData.sort((a, b) => {
          if (a.id > b.id) {
            return 1;
          }
          if (a.id < b.id) {
            return -1;
          }
          return 0;
        });
        setInventory(inventoryDataSorted);
        setFiltredInventory(inventoryDataSorted);
      }
    );
    return unSuscribeInventory;
  };

  useEffect(() => {
    getTrabajadores();
    getInventory();
  }, []);

  const addInventory = async (e) => {
    e.preventDefault();

    if (nowEdit) {
      const inventoryRef = doc(db, "inventario", currentItem.id);
      const inventoryData = {
        codigo: currentItem.codigo,
        nombre: currentItem.nombre,
        cantidad: currentItem.cantidad,
        extraidoPor: currentItem.extraidoPor,
        fechaDeIngreso: currentItem.fechaDeIngreso,
      };
      await updateDoc(inventoryRef, inventoryData).then(() => {
        console.log("Document successfully written!");
      });
      setNowEdit(false);
      e.target[0].value = "";
      e.target[1].value = "";
      e.target[2].value = "";
      return;
    }

    const inventoryRef = doc(db, "inventario", e.target[1].value);
    const inventoryData = {
      nombre: e.target[0].value,
      codigo: e.target[1].value,
      cantidad: Number.parseInt(e.target[2].value),
      extraidoPor: "no",
      fechaDeIngreso: new Date().toLocaleDateString(),
    };
    await addDoc(inventoryRef, inventoryData).then(() => {
      console.log("Document successfully written!");
    });
  };
  const getTrabajadores = async () => {
    getDocs(collection(db, "usuarios")).then((querySnapshot) => {
      const trabajadoresData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrabajadores(trabajadoresData);
    });
  };

  return (
    <div className="grid grid-cols-4  p-5 row-span-5 w-full h-full overflow-hidden">
      <div className="lg:col-span-1 col-span-4 h-full">
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
            required
            value={nowEdit && currentItem ? currentItem.id : nombre}
            onChange={(e) => {
              nowEdit
                ? setCurrentItem({ ...currentItem, id: e.target.value })
                : setNombre(e.target.value);
            }}
            className="border-2 border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="Nombre del producto"
          />
          <input
            required
            value={nowEdit && currentItem ? currentItem.codigo : codigo}
            onChange={(e) => {
              nowEdit
                ? setCurrentItem({ ...currentItem, codigo: e.target.value })
                : setCodigo(e.target.value);
            }}
            className="border-2 border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="Código del producto"
          />
          <input
            required
            value={nowEdit && currentItem ? currentItem.cantidad : cantidad}
            onChange={(e) => {
              nowEdit
                ? setCurrentItem({
                    ...currentItem,
                    cantidad: Number.parseInt(e.target.value),
                  })
                : setCantidad(e.target.value);
            }}
            className="border-2 border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:border-blue-400"
            type="number"
            placeholder="Cantidad del producto"
          />
          <button className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all active:scale-95">
            {!nowEdit ? "Agregar" : "Editar"}
          </button>
          <button
            type="button"
            onClick={() => {
              //solicitar un archivo
              const file = document.createElement("input");
              file.type = "file";
              file.accept = ".xlsx";
              file.click();
              file.addEventListener("change", async (e) => {
                let content = await excelReader(e.target.files[0]).then(
                  (content) => {
                    return content;
                  }
                );
                content.map((item) => {
                  if (item) {
                    console.log(item);
                    const inventoryRef = doc(db, "inventario", item.codigo);

                    const inventoryData = {
                      codigo: item.codigo,
                      nombre: item.nombre,
                      cantidad: item.cantidad,
                      extraidoPor: item.extraidoPor,
                      fechaDeIngreso: item.fechaIngreso,
                    };
                    setDoc(inventoryRef, inventoryData)
                      .then(() => {
                        console.log("Document successfully written!");
                      })
                      .catch((error) => {
                        console.error("Error writing document: ", error);
                      });
                  }
                });
              });
            }}
            className="bg-gradient-to-r from-green-500 to-lime-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-green-500 transition-all active:scale-95 flex flex-row-reverse font-bold text-lg justify-center items-center gap-2"
          >
            <p>Excel</p>
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </button>
        </form>
      </div>
      <table className="flex flex-col col-span-full lg:col-span-3 row-span-5 w-full h-96 text-center overflow-auto text-xs lg:text-md">
        <thead className="grid grid-cols-1  ">
          <tr className="border-2 border-purple-500 grid grid-cols-6 items-center p-2 gap-5 ">
            <th>
              <select
                onChange={(e) => {
                  if (e.target.value === "Código") {
                    setInventory(filtredInventory);
                    return;
                  }
                  setInventory(
                    filtredInventory.filter(
                      (item) => item.codigo === e.target.value
                    )
                  );
                }}
                className="border-2 w-full border-gray-300 rounded-lg p-2 bg-transparent focus:outline-none focus:border-blue-400"
              >
                <option className="text-black" value="Código">
                  Código
                </option>
                {
                  //remove duplicates
                  filtredInventory
                    .map((item) => item.codigo)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .map((item) => (
                      <option className="text-black" value={item} key={item}>
                        {item}
                      </option>
                    ))
                }
              </select>
            </th>
            <th>
              {" "}
              <select
                onChange={(e) => {
                  if (e.target.value === "Nombre") {
                    setInventory(filtredInventory);
                    return;
                  }
                  setInventory(
                    filtredInventory.filter(
                      (item) => item.nombre === e.target.value
                    )
                  );
                }}
                className="border-2 border-gray-300 rounded-lg p-2 bg-transparent focus:outline-none focus:border-blue-400 w-full"
              >
                <option className="text-black" value="Nombre">
                  Nombre
                </option>
                {filtredInventory.map((item) => (
                  <option
                    className="text-black"
                    value={item.nombre}
                    key={item.id}
                  >
                    {item.nombre}
                  </option>
                ))}
              </select>
            </th>
            <th>Cantidad</th>
            <th>Extraido por</th>
            <th>Fecha de ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="overflow-auto  col-span-full lg:grid lg:grid-cols-1">
          {inventory.map((item) => (
            <tr
              key={item.id}
              className={
                nowEdit && currentItem && currentItem.id === item.id
                  ? "border-b-2 border-purple-500 grid grid-cols-6 items-center justify-center p-2  bg-purple-500 bg-opacity-20 h-fit"
                  : "border-b-2 border-purple-500 grid grid-cols-6 items-center justify-center p-2  h-fit"
              }
            >
              <td>{item.codigo}</td>
              <td>{item.nombre}</td>
              <td
                className={item.cantidad < 10 ? "text-red-500 font-bold" : ""}
              >
                {item.cantidad}
              </td>
              <td>{item.extraidoPor}</td>
              <td>{item.fechaDeIngreso}</td>
              <td className="flex flex-row justify-evenly">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                  onClick={() => {
                    setNowEdit(!nowEdit);
                    setCurrentItem(item);
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
                    setCurrentItem(item);
                    setCurrentItem(item);
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

      {nowExtract ? (
        <div className="fixed row-span-5 bg-black top-0 left-0 right-0 h-screen flex flex-col items-center justify-center bg-opacity-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(Number.parseInt(e.target[2].value));
              const inventoryRef = doc(db, "inventario", currentItem.id);
              const inventoryData = {
                ...currentItem,
                cantidad:
                  currentItem.cantidad - Number.parseInt(e.target[2].value),
                extraidoPor: e.target[3].value,
              };
              updateDoc(inventoryRef, inventoryData).then(() => {
                console.log("Document successfully written!");
              });
            }}
            className={
              localStorage.getItem("theme") === "dark"
                ? "flex flex-col p-5 gap-5 bg-zinc-900 rounded-xl shadow-lg shadow-slate-700 w-72"
                : "flex flex-col p-5 gap-5 bg-white rounded-xl shadow-lg shadow-slate-700 w-72"
            }
          >
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
                Extraer producto
              </h2>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition-all active:scale-95 flex flex-row items-center justify-center gap-5 w-fit"
                onClick={() => {
                  setNowExtract(!nowExtract);
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <select
              onChange={(e) => {
                console.log(e.target.value);
              }}
              value={currentItem.id}
              className="border-2 border-gray-300 bg-transparent rounded-lg p-2 focus:outline-none focus:border-blue-400"
            >
              {inventory.map((item) => (
                <option className="text-black" key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
            <input
              required
              className="border-2 border-gray-300 text-black rounded-lg p-2 focus:outline-none focus:border-blue-400"
              type="number"
              placeholder="Cantidad del producto"
              onChange={(e) => {
                if (e.target.value > currentItem.cantidad) {
                  e.target.value = currentItem.cantidad;
                }
              }}
            />
            <select className="border-2 border-gray-300 bg-transparent rounded-lg p-2 focus:outline-none focus:border-blue-400">
              {trabajadores.map((trabajador) => (
                <option
                  className="text-black"
                  key={trabajador.id}
                  value={trabajador.id}
                >
                  {trabajador.id}
                </option>
              ))}
            </select>
            <button className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all active:scale-95">
              Extraer
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AddInventoryForm;
