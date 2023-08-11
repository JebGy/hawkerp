import React from "react";

function BarSideButtons({ fun, title, ...props }) {
  return (
    <button
      onClick={
        fun
      }
      className="active:scale-95  hover:bg-gray-200 hover:text-black transition-all text-left flex flex-row justify-start items-center p-2 rounded-lg"
    >
      {props.children}
      <span className="ml-2">{title}</span>
    </button>
  );
}

export default BarSideButtons;
