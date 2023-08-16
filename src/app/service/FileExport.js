import { dowloadFile } from "../firebase/firebaseConf";

//md to html
export const createReportHtml = async (reporte, trabajadorEdit) => {
  const headers = [
    `<div style="width: fit-content; display:flex; flex-direction: row; align-items: center; gap:5rem; padding: 1rem;">
    <img src="https://www.electrotecniamundial.com/wp-content/uploads/2022/11/Logo-PNG-Fondo-Transparente.png" alt="logo" style="width: 150px; height: 150px; object-fit: cover; "/>
      <h1 style="text-align:  left; color: #6a26c9;  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; fotn-size: 2rem;
      ">Reporte actividad de usuario ${trabajadorEdit.user} ${reporte.fecha}</h1>
    </div>`,
    "<hr/>",
  ];
  let isReady = false;
  reporte.lista.forEach((value, index, array) => {
    dowloadFile(value.imagenurl).then((url) => {
      headers.push(
        `<h2 style="text-align: left; padding:1rem; color: #6a26c9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${value.hora}</h2>`
      );
      headers.push(
        `<h3 style="text-align: left; padding:2rem; color: #4c4259; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${value.actividad}</h3>`
      );
      headers.push(
        `<div style="width: 500px height: 500px; text-align: center; padding:2rem; 
        "><img src="${url}" alt="${value.actividad}" style="height: 500px; width: 500px; border-radius: 20px; object-fit: cover; "/></div>`
      );
      headers.push(`<hr/>`);
    });
  });
  setTimeout(() => {
    if (headers.length > 1) {
      const file = new Blob([headers.join("\n")], { type: "text/html" });
      console.log(headers.length * 100);
      //file to html
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reporte ${trabajadorEdit.user} ${reporte.fecha}.html`;
      a.click();
      isReady = true;
    }
  }, 2000);
};
