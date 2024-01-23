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
import React from "react";

function TaskTable({ tasks, area, areaId }) {
  const db = getFirestore(app);

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
        getTrabajadores();
        querySnapshot.docs;
      })
      .then(() => {
        setIsLoaded(true);
      });
  };
  return (
    <table className=" w-full">
      <thead className="">
        <th className="w-96">Áreas</th>
        <th className="w-96">Población</th>
        <th className="w-96">Título</th>
        <th className="w-96">Descripción</th>
        <th>Responsable</th>
        <th>Acciones</th>
      </thead>
      <tbody className="">
        {tasks.map((value, index, array) => {
          if (value._taskId === areaId) {
            return (
              <tr key={index}>
                <td>{area.data()._areaName}</td>
                <td className="w-96">{area.data()._areaPopulation}</td>
                <td className="w-96">{value._taskName}</td>
                <td className="w-96">{value._taskDescription}</td>
                <td>{value._worker}</td>
                <td className="grid-cols-2 grid">
                  <button
                    className="transition-all active:scale-95 hover:shadow-xl hover:shadow-green-500 p-2 rounded-full"
                    onClick={() => {
                      const taskRef = doc(db, "areas", task._taskId);

                      updateDoc(taskRef, {
                        _tareas: arrayRemove({
                          _taskId: value._taskId,
                          _taskName: value._taskName,
                          _taskDescription: value._taskDescription,
                          _worker: value._worker,
                          _taskIsDone: value._taskIsDone,
                        }),
                      });

                      updateDoc(taskRef, {
                        _tareas: arrayUnion({
                          _taskId: task._taskId,
                          _taskName: task._taskName,
                          _taskIsDone: true,
                        }),
                      }).then(() => {
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
                      const taskRef = doc(db, "areas", value._taskId);

                      updateDoc(taskRef, {
                        _tareas: arrayRemove({
                          _taskId: value._taskId,
                          _taskName: value._taskName,
                          _taskDescription: value._taskDescription,
                          _worker: value._worker,
                          _taskIsDone: value._taskIsDone,
                        }),
                      }).then(() => {
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
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}

export default TaskTable;
