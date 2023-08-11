/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { app, compressAndUploadFile, dowloadFile, uploadFile } from "@/app/firebase/firebaseConf";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  collectionWithDocument,
  setDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect } from "react";
import ReportItem from "./ReportItem";

function MisReportes() {
  const [user, setUser] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [reportes, setReportes] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [reporteEdit, setReporteEdit] = React.useState(null);
  const [listaSubTareas, setListaSubTareas] = React.useState([]);
  const [loadedLista, setLoadedLista] = React.useState(false);
  const [urlImages, setUrlImages] = React.useState([]);
  const [send, setSend] = React.useState(false);

  const today =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDate();

  const db = getFirestore(app);

  useEffect(() => {
    createReport();
  }, [isLoaded]);

  useEffect(() => {
    const _user = JSON.parse(sessionStorage.getItem("user"));
    if (_user === null) {
      window.location.href = "/";
      return;
    }
    setUser(_user);
    const listaSubEdit = JSON.parse(localStorage.getItem("listaSubTareas"));
    if (listaSubEdit) {
      setListaSubTareas(listaSubEdit);
    }
    setIsLoaded(true);
  }, [openModal]);

  const getListaSubTareas = async () => {
    if (user) {
      await getDoc(doc(db, `usuarios/${user.user}/reportes`, today))
        .then((doc) => {
          if (doc.exists()) {
            setListaSubTareas(doc.data().lista);
            setListaSubTareas(doc.data().lista);
            doc.data().lista.map((subTarea) => {
              dowloadFile(subTarea.imagenurl).then((url) => {
                console.log(url.url);
                setUrlImages([...urlImages, url]);
              });
            });
            setLoadedLista(true);
            setLoadedLista(true);
          } else {
            // doc.data() will be undefined in this case
            ("No such document!");
          }
        })
        .catch((error) => {
          "Error getting document:", error;
        });
    }
  };

  const createReport = async () => {
    if (user) {
      const reporte = {
        lista: [],
        fecha: today,
        estado: true,
      };

      await getDocs(
        query(collection(db, `usuarios/${user.user}/reportes`)),
        orderBy("fecha", "desc")
      ).then((querySnapshot) => {
        if (
          querySnapshot.docs.some((doc) => {
            return doc.id === today;
          })
        ) {
          ("si");
        } else {
          ("no");
          createReporte();
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
      });
    }
  };

  const createReporte = async () => {
    if (user) {
      const reporte = {
        lista: [],
        fecha: today,
        estado: false,
      };

      await setDoc(
        doc(db, `usuarios/${user.user}/reportes`, today),
        reporte
      ).then(() => {
        if (
          window.confirm(
            "Se ha creado un reporte para el día de hoy, Debe completarlo ahora."
          )
        ) {
          createReport();
        } else {
          alert(
            "No se creó el reporte para el día de hoy, puede crearlo más tarde."
          );
        }
      });

      setIsLoaded(true);
    }
  };

  const handleUpdate = async () => {
    if (window.confirm("¿Está seguro de completar el reporte?")) {
      await updateDoc(
        doc(db, `usuarios/${user.user}/reportes`, reporteEdit.id),
        {
          ...reporteEdit.data(),
          lista: listaSubTareas,
          estado: true,
        }
      ).then(() => {
        alert("Se ha completado el reporte correctamente");
        localStorage.removeItem("reporteEdit");
        localStorage.removeItem("listaSubTareas");
        createReport();
        setOpenModal(false);
      });
    }
  };

  return (
    <div>
      {isLoaded ? (
        <div className="p-5 ">
          <div className="flex flex-row justify-between items-center mb-5 ">
            <div className="flex flex-row justify-center items-center gap-5">
              <button
                onClick={() => {
                  window.location.href = "/trabajador";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={4}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Reporte diario</h1>
            </div>
          </div>
          <div className="lg:grid-cols-3 gap-5 grid">
            {reportes.map((reporte) => {
              return (
                <div
                  key={reporte.id}
                  className="flex flex-col w-full rounded-lg bg-neutral-100 shadow-xl"
                >
                  <div className="font-bold text-x items-center  p-5 rounded-t-lg flex flex-row justify-between">
                    <p>
                      {reporte.id.split("-")[2] +
                        "/" +
                        reporte.id.split("-")[1] +
                        "/" +
                        reporte.id.split("-")[0]}
                    </p>
                    {today === reporte.id && !reporte.data().estado ? (
                      <button
                        onClick={() => {
                          getListaSubTareas();
                          alert(
                            "Las actividades se guardan automaticamente. Al finalizar su jornada, presione el boton 'Completar Reporte'"
                          );
                          setReporteEdit(reporte);
                          //validate localStorage
                          if (
                            JSON.parse(localStorage.getItem("reporteEdit")) !==
                            null
                          ) {
                            setListaSubTareas(
                              JSON.parse(localStorage.getItem("reporteEdit"))
                            );
                            setListaSubTareas(
                              JSON.parse(localStorage.getItem("reporteEdit"))
                            );
                          } else {
                            setListaSubTareas(reporte.data().lista);
                          }
                          setOpenModal(true);
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg active:scale-90 transition duration-150"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="p-5 mb-2">
                    {reporte.data().lista.length < 1 ? (
                      <div className="flex flex-row  items-center gap-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-8 h-8 text-orange-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                          />
                        </svg>
                        <h2 className="text-xl font-bold">No hay datos!</h2>
                      </div>
                    ) : (
                      <div className="flex flex-row  items-center gap-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className="w-6 h-6 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <h2 className="text-xl font-bold">Completado</h2>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center w-full h-full">
            <h1 className="text-3xl font-bold mb-5">Cargando...</h1>
          </div>
        </div>
      )}

      {openModal ? (
        <div className="fixed z-10 inset-0 overflow-y-auto w-screen h-screen bg-black bg-opacity-70 p-5">
          <button
            onClick={() => {
              localStorage.setItem(
                "reporteEdit",
                JSON.stringify(listaSubTareas)
              );
              setOpenModal(false);
            }}
            className="p-2 z-50 rounded-full bg-red-500 active:scale-95 transition-all duration-150 absolute top-5 right-5 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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

          <div className="flex flex-col justify-center items-center w-full h-full">
            <form
              className="flex flex-col justify-center items-center w-96 lg:w-96 md:w-3/6 p-15 rounded-t-lg bg-white"
              onSubmit={(e) => {
                e.preventDefault();
                setSend(true);
                let reportname = reporteEdit.id;
                
                if (e.target[1].files[0] !== undefined) {
                  const urlImage =
                  user.user +
                  "/" +
                  reportname +
                  "/" +
                  e.target[1].files[0].name;
                  compressAndUploadFile(e.target[1].files[0], urlImage).then(() => {
                    const report = {
                      actividad: e.target[0].value,
                      hora: new Date().toLocaleTimeString("en-US", {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric",
                      }),
                      imagenurl: urlImage,
                    };
                    updateDoc(
                      doc(db, `usuarios/${user.user}/reportes`, reporteEdit.id),
                      {
                        ...reporteEdit.data(),
                        lista: arrayUnion(report),
                        estado: false,
                      }
                    ).then(() => {
                      alert("Se ha agregado la actividad correctamente");
                      setSend(false);
                      e.target[0].value = "";
                      e.target[1].value = "";
                      getListaSubTareas();
                    });
                  });
                } else {
                  const report = {
                    actividad: e.target[0].value,
                    hora: new Date().toLocaleTimeString("en-US", {
                      hour12: true,
                      hour: "numeric",
                      minute: "numeric",
                    }),
                    imagenurl: "",
                  };

                  updateDoc(
                    doc(db, `usuarios/${user.user}/reportes`, reporteEdit.id),
                    {
                      ...reporteEdit.data(),
                      lista: arrayUnion(report),
                      estado: false,
                    }
                  ).then(() => {
                    alert("Se ha agregado la actividad correctamente");
                    e.target[0].value = "";
                    e.target[1].value = "";
                    getListaSubTareas();
                  });
                }
              }}
            >
              <h1 className="text-xl font-bold mb-5 mt-5">
                Complete el reporte de {reporteEdit.id}
              </h1>
              <div className="flex flex-col justify-between items-center  gap-5 px-5">
                <input
                  type="text"
                  placeholder="Actividad realizada"
                  className="w-5/6 h-10 px-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <label>Imagen de actividad:</label>
                <input type="file" className="w-5/6" />
                <button
                  type="submit"
                  disabled={send}
                  className="disabled:opacity-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150"
                >
                  Agregar
                </button>
              </div>
            </form>

            <div className="flex flex-col bg-white rounded-b-xl w-96 p-7 max-h-64 lg:w-96 md:w-3/6 overflow-y-auto">
              {loadedLista && listaSubTareas
                ? listaSubTareas.map((subTarea, index) => {
                    return (
                      <ReportItem
                        key={index}
                        url={subTarea.imagenurl}
                        actividad={subTarea.actividad}
                        hora={subTarea.hora}
                      />
                    );
                  })
                : null}
            </div>
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded active:scale-90 transition duration-150 mt-5"
            >
              Completar Reporte
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MisReportes;
