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
  apiKey: "AIzaSyDwqB_KJrIRRYpAC_yJyEtvp1KvyopYnho",
  authDomain: "hawkerp-c1ef5.firebaseapp.com",
  projectId: "hawkerp-c1ef5",
  storageBucket: "hawkerp-c1ef5.appspot.com",
  messagingSenderId: "684924526135",
  appId: "1:684924526135:web:3537012f9ad257774ea9b2"
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
