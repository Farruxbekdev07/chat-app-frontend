import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { db } from "src/firebase/config";

interface UserWithLastMessage {
  uid: string;
  image: string;
  fullName: string;
  username: string;
  lastMessage?: {
    text: string;
    createdAt: Timestamp;
  };
}

export const useUsersWithLastMessage = () => {
  const [userList, setUserList] = useState<UserWithLastMessage[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(collection(db, "users"), async (snapshot) => {
      const usersWithMsg: UserWithLastMessage[] = [];

      for (const docSnap of snapshot.docs) {
        const user = docSnap.data();
        if (user.uid === currentUser.uid) continue;

        const chatId = [currentUser.uid, user.uid].sort().join("_");
        const messagesRef = collection(db, "chats", chatId, "messages");

        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const messageSnapshot = await getDocs(q);

        let lastMessage;
        if (!messageSnapshot.empty) {
          const msgDoc = messageSnapshot.docs[0].data();
          lastMessage = {
            text: msgDoc.text,
            createdAt: msgDoc.createdAt,
          };
        }

        usersWithMsg.push({
          uid: user.uid,
          fullName: user.fullName,
          username: user.username,
          image: "",
          lastMessage,
        });
      }

      setUserList(usersWithMsg);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  return userList;
};
