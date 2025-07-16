import { useEffect, useState } from "react";
import {
  doc,
  query,
  limit,
  orderBy,
  getDocs,
  Timestamp,
  onSnapshot,
  writeBatch,
  collection,
} from "firebase/firestore";
import { db } from "src/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

interface LastMessage {
  text: string;
  seenBy: string[];
  senderId: string;
  imageUrl?: string;
  createdAt: Timestamp;
}

export interface UserWithLastMessage {
  uid: string;
  image: string;
  fullName: string;
  username: string;
  unreadCount: number;
  lastMessage?: LastMessage | null;
}

interface User {
  uid: string;
  image: string;
  fullName: string;
  username: string;
  unreadCount: number;
  lastMessage?: LastMessage;
}

export const useUsersWithLastMessage = () => {
  const [userList, setUserList] = useState<UserWithLastMessage[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (userSnapshot) => {
        const unsubscribers: (() => void)[] = [];

        userSnapshot.forEach((userDoc) => {
          const user = userDoc.data();
          if (user.uid === currentUser.uid) return;

          const chatId = [currentUser.uid, user.uid].sort().join("_");
          const messagesRef = collection(db, "chats", chatId, "messages");

          const q = query(messagesRef, orderBy("createdAt", "desc"), limit(10));

          const unsubscribeMsg = onSnapshot(q, (msgSnapshot) => {
            let validMessages = msgSnapshot.docs
              .map((d) => d.data())
              .filter((m) => m.text || m.imageUrl); // faqat o‘chirilmagan xabarlar

            const lastMsgData = validMessages[0] || null;

            let lastMessage: LastMessage | null = null;
            let unreadCount = 0;

            if (lastMsgData) {
              lastMessage = {
                text: lastMsgData.text || "",
                createdAt: lastMsgData.createdAt,
                imageUrl: lastMsgData.imageUrl,
                seenBy: lastMsgData.seenBy || [],
                senderId: lastMsgData.senderId || "",
              };

              unreadCount =
                lastMessage.senderId === user.uid &&
                !lastMessage.seenBy.includes(currentUser.uid)
                  ? 1
                  : 0;
            }

            const userObj: UserWithLastMessage = {
              uid: user.uid,
              image: user.image || "",
              fullName: user.fullName,
              username: user.username,
              lastMessage,
              unreadCount,
            };

            setUserList((prev) => {
              const updated = prev.filter((u) => u.uid !== user.uid);
              const newList = [...updated, userObj];
              newList.sort((a, b) => {
                const aTime = a.lastMessage?.createdAt?.toMillis?.() || 0;
                const bTime = b.lastMessage?.createdAt?.toMillis?.() || 0;
                return bTime - aTime;
              });
              return newList;
            });
          });

          unsubscribers.push(unsubscribeMsg);
        });

        return () => {
          unsubscribers.forEach((unsub) => unsub());
        };
      }
    );

    return () => unsubscribeUsers();
  }, [currentUser?.uid]);

  return userList;
};

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData: User[] = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== currentUser.uid)
        .map((user) => ({
          uid: user.uid,
          image: user.image || "",
          fullName: user.fullName,
          username: user.username,
          unreadCount: 0,
        }));

      setUsers(usersData);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  return users;
};

export const deleteChatWithUser = async (
  currentUserId: string,
  otherUserId: string
) => {
  try {
    const chatId = [currentUserId, otherUserId].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");

    const snapshot = await getDocs(messagesRef);

    const batch = writeBatch(db);

    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    const typingStatusRef = doc(
      db,
      "chats",
      chatId,
      "typingStatus",
      currentUserId
    );
    batch.delete(typingStatusRef);

    await batch.commit();
    console.log("Chat deleted successfully");
  } catch (error) {
    console.error("Error deleting chat: ", error);
  }
};
