// firebase packages
import { doc, setDoc } from "firebase/firestore";

// local files
import { db } from "./config";

export const createUser = async (
  user: any,
  profileData: { name: string; username: string; photoURL?: string }
) => {
  return await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    ...profileData,
    createdAt: new Date(),
  });
};
