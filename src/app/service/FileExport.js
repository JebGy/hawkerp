import { dowloadFile } from "../firebase/firebaseConf";

export const createReportMd = async (reporte, trabajadorEdit) => {
  const headers = [
    `# Reporte actividad de usuario ${trabajadorEdit.user} ${reporte.fecha}`,
  ];
  let isReady = false;
  reporte.lista.forEach((value, index, array) => {
    dowloadFile(value.imagenurl).then((url) => {
      headers.push(`## ${value.hora}`);
      headers.push(`### ${value.actividad}`);
      headers.push(`![${value.actividad}](${url})`);
      headers.push(`\n---\n`);
    });
  });
  setTimeout(() => {
    headers.push("## Fin del reporte");
    console.log(isReady);
    //create a file
    const file = new Blob([headers.join("\n")], { type: "text/markdown" });
    //create a url
    const url = URL.createObjectURL(file);

    //create a tag <a>
    const a = document.createElement("a");
    //add url to a
    a.href = url;
    //add name to a
    a.download = `Reporte ${trabajadorEdit.user} ${reporte.fecha}.md`;
    //click a
    a.click();
  }, 1500);
};

// Cambia esto a la ruta deseada para el archivo PDF de salida

// Lee el archivo .md
