/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import DashboardCard from "@/components/dashboardComps/DashboardCard";
import TrabCard from "@/components/trabajadorComps/TrabCard";
import React, { useState } from "react";
import tareasImage from "../../../public/tareas.svg";
import Image from "next/image";

function page() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === null) {
      window.location.href = "/";
      return;
    }
    setUser(user);
    setIsLoaded(true);
  }, []);

  return (
    <div className="p-5 h-screen w-screen flex flex-col justify-between">
      <div className="flex flex-col justify-center">
        <header className="flex flex-row justify-between items-center">
          <h2 className="font-bold text-2xl">
            Bienvenido, {user ? user.user : null}
          </h2>
          <button
            className="bg-red-500 text-white rounded-md p-2"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </button>
        </header>
        <div className="flex flex-col">
          {isLoaded ? (
            <div className="flex flex-col gap-5 mt-5">
              <DashboardCard
                title="Tareas Individuales"
                gradient="from-red-500 to-pink-300"
                shadow="from-red-600 to-pink-400"
                text="Gestionar mis tareas individuales"
                idX={0}
                currentView={0}
                funcion={() => (window.location.href = "/trabajador/misTareas")}
              />
              <DashboardCard
                title="Tareas de área"
                gradient="from-green-500 to-blue-300"
                shadow="from-green-600 to-blue-400"
                text="Gestionar mis tareas de área"
                idX={1}
                currentView={0}
                funcion={() =>
                  (window.location.href = "/trabajador/areaTareas")
                }
              />
            </div>
          ) : null}
        </div>
      </div>
      <Image src={tareasImage} alt="tareas" />
    </div>
  );
}

export default page;
