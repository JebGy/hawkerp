"use client";
import { app } from "@/app/firebase/firebaseConf";
import { hashPassword } from "@/app/service/hasherSecurity";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import React from "react";

function LoginForm({ ...props }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [rol, setRol] = React.useState("");

  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    (hashPassword(e.target[1].value));
    const userRef = doc(db, "usuarios", e.target[0].value);
    if (!props.reg) {
      await getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const user = docSnap.data();

          if (user.password === hashPassword(e.target[1].value)) {
            //navigate to home
            sessionStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/dashboard";
          } else {
            alert("Contraseña incorrecta");
          }
        } else {
          alert("Usuario no existe");
        }
      });
    } else {
      await getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          alert("Usuario ya existe");
        } else {
          (rol);
          const user = {
            user: e.target[0].value,
            password: hashPassword(e.target[1].value),
            access: [false, false, false, false,false],
            primary: false,
            tareas:[],
            rol: rol,
            auth: false,
          };

          setDoc(doc(db, "usuarios", user.user), user).then(() => {
            alert("Usuario creado");
            sessionStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/dashboard";
          });
        }
      });
    }
  };

  return (
    <div className="col-span-2 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-5 text-stone-800">
        {props.reg ? "Registro" : "Inicio de sesión"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="p-10  rounded-xl shadow-xl border-2 border-orange-950 shadow-orange-950 flex flex-col items-center bg-white"
      >
        <input
          type="text"
          placeholder="Usuario"
          className="outline-none mb-5 p-2 w-full focus:border-b-2 border-2 border-gray-300 rounded-lg focus:border-orange-950 transition-all bg-inherit"
          required
        />
        <div className="flex flex-row items-center justify-center gap-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="outline-none p-2 w-full focus:border-b-2 border-2 border-gray-300 rounded-lg focus:border-orange-950 transition-all bg-inherit"
            required
          />
          <button
            className="text-orange-950 active:scale-95"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
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
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
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
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {
          // eslint-disable-next-line react/jsx-no-undef
          props.reg ? (
            <select
              className="w-full mb-5 p-2 outline-none bg-inherit"
              name="rol"
              onChange={(e) => {
                setRol(e.target.value);
              }}
            >
              <option value="0">Selecciona un rol</option>
              <option value="1">Trabajador</option>
            </select>
          ) : null
        }
        <button
          type="submit"
          className="bg-gradient-to-r mt-5 from-orange-950 to-orange-500 text-white p-2 rounded-lg w-full mb-5 hover:shadow-lg hover:shadow-orange-950 transition-all active:scale-95"
        >
          {props.reg ? "Registrarse" : "Iniciar sesión"}
        </button>
        {props.reg ? null : (
          <Link href="/register" className="underline underline-offset-4">
            Registrarse
          </Link>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
