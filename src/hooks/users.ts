import { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
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
    createdAt: any;
  };
}

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const currentUid = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== currentUid);

      setUsers(userList);
    });

    return () => unsubscribe();
  }, [currentUid]);

  return users;
};

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
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        const lastMsg = chatSnap.exists() ? chatSnap.data().lastMessage : null;

        usersWithMsg.push({
          uid: user.uid,
          fullName: user.fullName,
          username: user.username,
          image: "",
          lastMessage: lastMsg
            ? {
                text: lastMsg.text,
                createdAt: lastMsg.createdAt,
              }
            : undefined,
        });
      }

      setUserList(usersWithMsg);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  return userList;
};
