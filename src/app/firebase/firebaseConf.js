import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import imageCompression from "browser-image-compression";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEnpuPdXUasfVoSZkYOiOtI11XwUiref8",
  authDomain: "emm-erp.firebaseapp.com",
  projectId: "emm-erp",
  storageBucket: "emm-erp.appspot.com",
  messagingSenderId: "622399363584",
  appId: "1:622399363584:web:802698509b9ff8f5b596e5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export const compressAndUploadFile = async (file, url) => {
  try {
    const options = {
      maxSizeMB: 0.5, // Maximum size in megabytes
      maxWidthOrHeight: 1920, // Max width or height
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

export const dowloadFile = async (urlImage) => {
  const storageRef = ref(storage, urlImage);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const deleteFile = async (id) => {
  const storageRef = ref(storage, `photos/${id}`);
  try {
    await deleteObject(storageRef);
    alert("File deleted successfully");
  } catch (error) {
    console.error("Error deleting the file:", error);
  }
};
