import {
  doc,
  query,
  where,
  setDoc,
  addDoc,
  getDocs,
  orderBy,
  onSnapshot,
  arrayUnion,
  collection,
  writeBatch,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/firebase/config";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
      const msgs: Message[] = snapshot.docs.map((doc, idx, arr) => {
        const data = doc.data();

        if (
          data.senderId !== currentUser.uid &&
          !(data.seenBy || []).includes(currentUser.uid)
        ) {
          updateDoc(doc.ref, {
            seenBy: [...(data.seenBy || []), currentUser.uid],
          });
        }

        return {
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          senderName: data.senderName,
          createdAt: data.createdAt,
          imageUrl: data.imageUrl,
          seenBy: data.seenBy || [],
          edited: data.edited || false,
        };
      });

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

  const sendMessage = async (text: string, imageUrl?: string) => {
    if (!currentUser || !selectedUser || (!text.trim() && !imageUrl)) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");

    const messageData = {
      text,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      imageUrl: imageUrl || null,
      createdAt: serverTimestamp(),
      seenBy: [currentUser.uid],
    };

    try {
      // 🔹 1. Xabarni saqlash
      await addDoc(collection(db, "chats", chatId, "messages"), messageData);

      // 🔹 2. Oxirgi xabarni yangilash
      await setDoc(
        doc(db, "chats", chatId),
        { lastMessage: messageData },
        { merge: true }
      );

      // 🔹 3. Notifications hujjatini yaratish yoki yangilash
      const notifRef = doc(db, "notifications", selectedUser.uid);
      await setDoc(
        notifRef,
        {
          message: `📨 ${currentUser.displayName || "Yangi xabar"}: "${text}"`,
          read: false,
          createdAt: serverTimestamp(),
        },
        { merge: true } // avvalgi hujjat ustiga yoziladi
      );
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
    }
  };

  return sendMessage;
};

export const markMessagesAsSeen = async (
  chatId: string,
  currentUserId: string
) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    where("seenBy", "not-in", [currentUserId])
  );

  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);

  querySnapshot.forEach((docSnap) => {
    const ref = doc(db, "chats", chatId, "messages", docSnap.id);
    batch.update(ref, {
      seenBy: arrayUnion(currentUserId),
    });
  });

  await batch.commit();
};
