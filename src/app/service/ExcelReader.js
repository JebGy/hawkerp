import readXlsxFile from "read-excel-file";

export const excelReader = (document) => {
  const content = readXlsxFile(document).then((rows) => {
    return rows.map((row, index) => {
      return {
        codigo: row[0],
        nombre: row[1],
        cantidad: row[2],
        extraidoPor: "no",
        fechaIngreso: new Date().toLocaleDateString(),
        id: row[0],
      };
    });
  });
  return content;
};
