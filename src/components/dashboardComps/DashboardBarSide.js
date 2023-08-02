"use client";
import { app } from "@/app/firebase/firebaseConf";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect } from "react";

function DashboardBarSide() {
  const db = getFirestore(app);
  const [usersList, setUsersList] = React.useState([]);
  const [_user, _setUser] = React.useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    _setUser(u);

    if (_user) {
      if (_user.primary) {
        getUsers();
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  const getUsers = async () => {
    await getDocs(collection(db, "usuarios")).then((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsersList(users);
    });
  };

  return (
    <div
      className={"col-span-1  h-screen w-full flex flex-col  justify-between"}
    >
      <div>
        <div className="flex flex-col justify-center items-center w-full h-20 ">
          <p className="text-xl font-bold">Usuarios</p>
        </div>
        {usersList.map((user, index) => {
          if (user.user === _user.user) {
            return null;
          }
          return (
            <button
              key={index}
              onClick={() => {
                if (window.confirm(`¿Desea cambiar de usuario?`)) {
                  localStorage.setItem("user", JSON.stringify(user));
                  window.location.reload();
                }
              }}
              className="active:scale-95 p-5 hover:bg-slate-200  w-full transition-all text-left"
            >
              {user.user}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/";
        }}
        className="active:scale-95 p-5 hover:bg-red-400 hover:text-white transition-all text-left w-full "
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default DashboardBarSide;
