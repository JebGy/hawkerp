import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import imageCompression from "browser-image-compression";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEnpuPdXUasfVoSZkYOiOtI11XwUiref8",
  authDomain: "emm-erp.firebaseapp.com",
  projectId: "emm-erp",
  storageBucket: "emm-erp.appspot.com",
  messagingSenderId: "622399363584",
  appId: "1:622399363584:web:802698509b9ff8f5b596e5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

/**
 * Comprime y sube un archivo a firebase storage
 * @param {File} file
 * @param {String} url
 */
export const compressAndUploadFile = async (file, url) => {
  try {
    const options = {
      maxSizeMB: 0.3, // Maximum size in megabytes
      maxWidthOrHeight: 1500, // Max width or height
      useWebWorker: true, // Use WebWorker for compression
    };

    const compressedFile = await imageCompression(file, options);

    const storageRef = ref(storage, url);
    uploadBytes(storageRef, compressedFile).then((snapshot) => {
      console.log("Uploaded a compressed blob or file!");
    });
  } catch (error) {
    console.error("Error compressing or uploading the file:", error);
  }
};

/**
 * Función para descargar archivos de firebase storage
 * @param {String} urlImage la url que en este caso es el path dentro del storage
 * @returns caso de encontrar el archivo retorna la url de descarga, caso contrario retorna una imagen por defecto
 */
export const dowloadFile = async (urlImage) => {
  try {
    const storageRef = ref(storage, urlImage);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  }
};

/**
 * Función para eliminar archivos de firebase storage
 */
export const deleteFile = async () => {
  //delete all
  const storageRef = ref(storage);
  const listRef = ref(storage, "/");
  //remove all images
  (await listAll(listRef)).prefixes.forEach((folderRef) => {
    // All the prefixes under listRef.
    // You may call listAll() recursively on them.
    console.log(folderRef.fullPath.split("/")[1]);
  });
};
