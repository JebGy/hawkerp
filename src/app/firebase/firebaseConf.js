// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export const uploadFile = async (file, url) => {
  const storageRef = ref(storage, url);
  await uploadBytes(storageRef, file).then((snapshot) => {
    alert("File uploaded successfully");
  });
};

export const dowloadFile = async (urlImage) => {
  const storageRef = ref(storage, urlImage);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const deleteFile = async (id) => {
  const storageRef = ref(storage, `photos/${id}`);
  deleteObject(storageRef)
    .then(() => {
      alert("File deleted successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};
