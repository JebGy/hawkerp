import Image from "next/image";
import addArea from "../../../public/addArea.svg";
import LoginForm from "../../components/loginComps/LoginForm";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid lg:grid-cols-4 md:grid md:grid-cols-4 w-screen h-screen">
      <div className="col-span-2  flex flex-col items-center justify-center h-full w-full">
        <h2 className="font-semibold text-4xl">
          EMM - ERP
        </h2>
        <p>Herramienta de Gestión</p>
        <Image
          src={addArea}
          alt="Picture of the author"
          className="object-contain "
        />
      </div>
      <LoginForm reg={true}/>
    </div>
  );
}
