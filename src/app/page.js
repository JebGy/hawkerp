import Image from "next/image";
import addArea from "../../public/Artboard 6.jpg";
import LoginForm from "@/components/loginComps/LoginForm";

/**
 * 
 * @returns Retorna la vista del login
 */
export default function Home() {
  return (
    <div className="grid grid-cols-1 p-10 lg:p-5 lg:grid lg:grid-cols-4 md:grid md:grid-cols-4 w-screen h-screen">
      <div className="col-span-2  flex flex-col items-center justify-center h-full w-full">
        <h2 className="font-semibold text-4xl">
          HAWKERP
        </h2>
        <p>Hawkcoded ERP</p>
        <Image
          src={addArea}
          alt="Picture of the author"
          className="object-contain h-96"
        />
      </div>
      <LoginForm />
      <div className="absolute bottom-0 left-0 right-0 flex flex-row text-xs justify-center items-center p-2">
        <p>Created by Munayco Rivera, Favio Gabriel - 2023</p>
      </div>
    </div>
  );
}
