import Link from "next/link";
import React from "react";

/**
 * 
 * @param {*} param0 
 * @returns Retorna la vista de un boton de la barra lateral 
 */
function BarSideButtons({ fun, title, ...props }) {
  return props.href ? (
    <Link
      onClick={props.href ? null : fun}
      href={props.href ? props.href : ""}
      className="active:scale-95  hover:bg-gray-200 hover:text-black transition-all text-left flex flex-row justify-start items-center p-2 rounded-lg"
    >
      {props.children}
      <span className="ml-2">{title}</span>
    </Link>
  ) : (
    <button
      onClick={fun}
      className="active:scale-95  hover:bg-gray-200 hover:text-black transition-all text-left flex flex-row justify-start items-center p-2 rounded-lg"
    >
      {props.children}
      <span className="ml-2">{title}</span>
    </button>
  );
}

export default BarSideButtons;
