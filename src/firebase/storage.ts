import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file: File) => {
  const fileRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};
