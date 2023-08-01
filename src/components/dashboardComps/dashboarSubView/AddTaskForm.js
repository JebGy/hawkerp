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
} from "firebase/firestore";
import { app } from "@/app/firebase/firebaseConf";

function AddTaskForm({ ...porps }) {
  const db = getFirestore(app);
  const [areas, setAreas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [taskList, setTaskList] = useState([]); // [ { _taskName: "Nombre de la tarea", _taskIsDone: false }

  const loadFromFirebase = async () => {
    await getDocs(collection(db, "areas"))
      .then((querySnapshot) => {
        setAreas(querySnapshot.docs);
        //add task list
        let _taskList = [];
        querySnapshot.docs.forEach((doc) => {
          doc.data()._tareas.forEach((task) => {
            _taskList.push(task);
          });
        });
        setTaskList(_taskList);
        console.log(querySnapshot.docs);
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  useEffect(() => {
    loadFromFirebase();
  }, []);

  const addTaskToFirebase = async (e) => {
    e.preventDefault();

    const taskRef = doc(db, "areas", e.target[1].value);
    await updateDoc(taskRef, {
      _tareas: arrayUnion({
        _taskId: e.target[1].value,
        _taskName: e.target[0].value,
        _taskIsDone: false,
      }),
    }).then(() => {
      alert("Tarea agregada con éxito");
      setIsLoaded(false);
      loadFromFirebase();
      e.target[0].value = "";
    });
  };

  return (
    <div className="grid grid-cols-3 p-5 row-span-3 w-full h-full">
      <div>
        <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
          Agregar Tarea
        </h2>
        <form
          className="p-5 flex flex-col justify-start items-center"
          onSubmit={(e) => {
            e.preventDefault();
            addTaskToFirebase(e);
          }}
        >
          <input
            type="text"
            placeholder="Nombre de la tarea"
            className="outline-none mb-5 p-2 w-full focus:border-b-2 focus:border-purple-500 transition-all"
          />
          <select className="underline underline-offset-4 p-4 outline-none w-full focus:border-b-2 focus:border-purple-500 transition-all mb-5 cursor-pointer">
            {isLoaded ? (
              areas.map((area) => {
                console.log(area.data()._areaName);
                return (
                  <option value={area.id} key={area.id}>
                    {area.data()._areaName}
                  </option>
                );
              })
            ) : (
              <option value="0">Cargando...</option>
            )}
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-full w-full p-2 hover:shadow-xl hover:shadow-purple-500 transition-all active:scale-95"
          >
            Asignar
          </button>
        </form>
      </div>

      <div className="w-full h-full col-span-2 flex flex-col overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-lg p-2 underline underline-offset-8 mb-2 col-span-2">
            Tareas
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
          {console.log(taskList)}
          {
            // Tareas
            isLoaded ? (
              areas.map((area) => {
                return (
                  <div
                    className="w-full flex flex-col justify-start items-start p-3 bg-neutral-100 shadow-lg mb-5 rounded-xl "
                    key={area.id}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <h3 className="text-lg font-bold ">
                        {area.data()._areaName}
                      </h3>
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
                              setIsLoaded(false);
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

                    <div className="w-full grid grid-flow-row grid-cols-3 gap-5 ">
                      {taskList.map((task, index) => {
                        if (task._taskId === area.id) {
                          return (
                            <div
                              className="w-full grid grid-cols-2 place-items-center justify-between items-center p-3 gap-5 bg-neutral-200 rounded-xl"
                              key={task._taskName}
                            >
                              <p
                                className={
                                  task._taskIsDone
                                    ? "line-through text-xs"
                                    : "text-xs"
                                }
                              >
                                {task._taskName}
                              </p>
                              <div className="w-full">
                                <button
                                  className="transition-all active:scale-95 hover:shadow-xl hover:shadow-green-500 p-2 rounded-full"
                                  onClick={() => {
                                    const taskRef = doc(
                                      db,
                                      "areas",
                                      task._taskId
                                    );

                                    updateDoc(taskRef, {
                                      _tareas: arrayRemove({
                                        _taskId: task._taskId,
                                        _taskName: task._taskName,
                                        _taskIsDone: false,
                                      }),
                                    });

                                    updateDoc(taskRef, {
                                      _tareas: arrayUnion({
                                        _taskId: task._taskId,
                                        _taskName: task._taskName,
                                        _taskIsDone: true,
                                      }),
                                    }).then(() => {
                                      setIsLoaded(false);
                                      loadFromFirebase();
                                    });
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={4}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-green-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  className="transition-all active:scale-95 hover:shadow-xl hover:shadow-red-500 p-2 rounded-full"
                                  onClick={() => {
                                    const taskRef = doc(
                                      db,
                                      "areas",
                                      task._taskId
                                    );

                                    updateDoc(taskRef, {
                                      _tareas: arrayRemove({
                                        _taskId: task._taskId,
                                        _taskName: task._taskName,
                                        _taskIsDone: task._taskIsDone,
                                      }),
                                    }).then(() => {
                                      setIsLoaded(!isLoaded);
                                      loadFromFirebase();
                                    });
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={4}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-red-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        }
                      })}
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

export default AddTaskForm;
