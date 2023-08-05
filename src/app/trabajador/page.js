/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import DashboardCard from "@/components/dashboardComps/DashboardCard";
import TrabCard from "@/components/trabajadorComps/TrabCard";
import React, { useState } from "react";
import tareasImage from "../../../public/tareas.svg";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";

function page() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user === null) {
      window.location.href = "/";
      return;
    }
    setUser(user);
    setIsLoaded(true);
  }, []);

  return (
    <div className="p-5 h-screen w-screen flex flex-col justify-between items-center">
      <div className="flex flex-col justify-center w-full">
        <header className="flex flex-row justify-between items-center">
          <h2 className="font-bold text-xl">
            Bienvenido, {user ? user.user : null}
          </h2>
          <button
            className="bg-red-500 text-white rounded-md p-2"
            onClick={() => {
              sessionStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </header>
        <div className="flex flex-col">
          {isLoaded && user.auth ? (
            <div className="grid grid-row lg:grid-cols-4 gap-5 mt-5">
              <DashboardCard
                title="Tareas Individuales"
                gradient="from-red-500 to-pink-300"
                shadow="from-red-600 to-pink-400"
                text="Gestionar mis tareas individuales."
                idX={0}
                currentView={0}
                funcion={() => redirect("/misTareas")}
              />
              <DashboardCard
                title="Tareas de área"
                gradient="from-green-500 to-blue-300"
                shadow="from-green-600 to-blue-400"
                text="Gestionar mis tareas de área"
                idX={1}
                currentView={0}
                funcion={() =>
                  redirect("/areaTareas")
                }
              />
              <DashboardCard
                title="Generar reporte diario"
                gradient="from-yellow-500 to-green-300"
                shadow="from-yellow-600 to-green-400"
                text="Generar reporte diario de tareas"
                idX={2}
                currentView={0}
                funcion={() =>
                  redirect("/reporteDiario")
                }
              />
              <DashboardCard
                title="Proximamente"
                gradient="from-orange-500 to-yellow-300"
                shadow="from-yellow-600 to-green-400"
                text="Funcionalidades próximas"
                idX={3}
                currentView={0}
                funcion={() =>
                  alert("Esta funcionalidad aún no está disponible.")
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5 mt-5">
              <h3 className="text-lg">
                Hola {user ? user.user : null}, tu usuario está pendiente de
                aprobación.{" "}
                <a
                  target="_blank"
                  href={`https://wa.me/+51949358892?text=Hola, mi nombre es ${
                    user ? user.user : null
                  }. Requiero autenticar mi cuenta de usuario.`}
                  className="text-purple-600 underline underline-offset-2 cursor-pointer hover:scale-95 active:scale-95 transition-all"
                >
                  {" "}
                  Comunícate con el departamento de TI{" "}
                </a>{" "}
                {"  "} para autenticar tu cuenta. Gracias.
              </h3>
            </div>
          )}
        </div>
      </div>
      <Image src={tareasImage} alt="tareas" height={300} />
    </div>
  );
}

export default page;
