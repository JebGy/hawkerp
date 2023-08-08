"use client";
import { dowloadFile } from "@/app/firebase/firebaseConf";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function ReportItem({ url, actividad, hora }) {
  const [image, setImage] = useState("");
  useEffect(() => {
    console.log("ReportItem");
  }, []);

  dowloadFile(url).then((url) => {
    setImage(url);
  });

  return (
    <div className="border-b-2 p-2 flex flex-col justify-between w-full">
      <div className="mb-5">
        <h3 className="text-lg">{actividad}</h3>
        <p className="text-rose-600 font-bold">{hora}</p>
      </div>
      {image ? (
        <Image
          src={image}
          alt="Picture of the author"
          width={500}
          height={500}
          className="rounded-lg"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ReportItem;
