import Image from "next/image";
import addArea from "../../public/logoHawk.png";
import LoginForm from "@/components/loginComps/LoginForm";

/**
 * 
 * @returns Retorna la vista del login
 */
export default function Home() {
  return (
    <div className="grid grid-cols-1 p-10 lg:p-5 lg:grid lg:grid-cols-4 md:grid md:grid-cols-4 w-screen h-screen bg-orange-50">
      <div className="col-span-2  flex flex-col items-center justify-center h-full w-full">
        <Image
          src={addArea}
          alt="Picture of the author"
          className="object-contain h-96"
        />
      </div>
      <LoginForm />
      <div className="absolute bottom-0 left-0 right-0 flex flex-row text-xs justify-center items-center p-2 text-white">
        <p>Created by Munayco Rivera, Favio Gabriel - 2023</p>
      </div>
    </div>
  );
}
