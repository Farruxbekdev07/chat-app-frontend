import { db } from "./config";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const messagesRef = collection(db, "messages");

export const sendMessage = async (text: string, uid: string) => {
  await addDoc(messagesRef, {
    text,
    uid,
    createdAt: new Date(),
  });
};

export const subscribeToMessages = (callback: (messages: any[]) => void) => {
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};
