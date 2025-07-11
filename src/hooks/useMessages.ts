import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "src/firebase/config";
import { RootState } from "src/redux/store";
import { Message } from "src/types/message";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!selectedUser || !currentUser?.uid) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        senderId: doc.data().senderId,
        senderName: doc.data().senderName,
        createdAt: doc.data().createdAt,
      }));
      setMessages(msgs);
    });

    return () => unsub();
  }, [selectedUser, currentUser?.uid]);

  return messages;
};

export const useSendMessage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );

  const sendMessage = async (text: string) => {
    if (!currentUser || !selectedUser || !text.trim()) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");

    const messageData = {
      text,
      senderId: currentUser.uid,
      fullName: currentUser.displayName,
      createdAt: serverTimestamp(),
    };

    try {
      // Add new message
      await addDoc(collection(db, "chats", chatId, "messages"), messageData);

      // Update lastMessage
      await setDoc(
        doc(db, "chats", chatId),
        {
          lastMessage: messageData,
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return sendMessage;
};
