"use client";
import { dowloadFile } from "@/app/firebase/firebaseConf";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function ReportItem({ url, actividad, hora }) {
  const [image, setImage] = useState("");
  const [view, setView] = useState(false);
  useEffect(() => {
    console.log("ReportItem");
  }, []);

  dowloadFile(url).then((url) => {
    setImage(url);
  });

  return (
    <div className="border-b-2 border-rose-500 p-2 grid grid-cols-2 gap-5 justify-between w-full">
      <div className="mb-5">
        <p className="text-rose-600 font-bold w-full border-b-2 border-rose-600 mb-5">
          {hora}
        </p>
        <h3 className="text-lg">{actividad}</h3>
      </div>
      {image || url === "" ? (
        <div className="w-full h-full">
          <Image
            onClick={() => {
              setView(!view);
            }}
            src={
              image
                ? image
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
            }
            alt="Picture of the author"
            width={250}
            height={250}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {view && (
        <div
          onClick={() => {
            setView(!view);
          }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[90]"
        >
          <div className="w-1/2 h-1/2 bg-white rounded-lg">
            <Image
              src={
                image
                  ? image
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
              }
              alt="Picture of the author"
              width={2500}
              height={800}
              priority={true}
              className="rounded-lg w-full h-96 object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportItem;
