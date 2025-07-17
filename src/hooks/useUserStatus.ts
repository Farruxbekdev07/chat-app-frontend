// src/hooks/useUserStatus.ts
import { useEffect, useState } from "react";
import { db, realtimeDb } from "src/firebase/config";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, onValue, onDisconnect, set } from "firebase/database";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

/**
 * Foydalanuvchining real-time typing va online statusini kuzatadi
 * @param currentUserId - hozirgi foydalanuvchi IDsi
 * @param selectedUserId - suhbatdagi (chat ochilgan) user IDsi
 */

export const useUserStatus = (
  currentUserId: string,
  selectedUserId: string
) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUserId || !selectedUserId) return;

    const chatId = [currentUserId, selectedUserId].sort().join("_");
    const typingRef = doc(db, "chats", chatId, "typingStatus", selectedUserId);

    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const data = snapshot.data();
      setIsTyping(data?.isTyping === true);
    });

    return () => unsubscribe();
  }, [currentUserId, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId) return;

    const presenceRef = ref(realtimeDb, `status/${selectedUserId}`);

    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      setIsOnline(data?.state === "online");
      setLastSeen(
        typeof data?.lastChanged === "number" ? data.lastChanged : null
      );
    });

    return () => unsubscribe();
  }, [selectedUserId]);

  console.log("last seen:", lastSeen);

  return { isTyping, isOnline, lastSeen };
};

export const useOnlineStatusWriter = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const userStatusRef = ref(realtimeDb, `status/${currentUser.uid}`);
    const connectedRef = ref(realtimeDb, ".info/connected");

    const isOffline = {
      state: "offline",
      lastChanged: serverTimestamp(),
    };

    const isOnline = {
      state: "online",
      lastChanged: serverTimestamp(),
    };

    const unsub = onValue(connectedRef, (snap) => {
      if (snap.val() === false) return;

      onDisconnect(userStatusRef)
        .set(isOffline)
        .then(() => {
          set(userStatusRef, isOnline);
        });
    });

    console.log("currentUser.uid:", currentUser?.uid);

    return () => {
      unsub();
      set(userStatusRef, isOffline);
    };
  }, [currentUser?.uid]);
};

export const useOnlineStatus = (userId: string) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const statusRef = ref(realtimeDb, `status/${userId}`);

    const unsub = onValue(statusRef, (snap) => {
      const data = snap.val();
      setIsOnline(data?.state === "online");
    });

    return () => unsub();
  }, [userId]);

  return isOnline;
};

export const useTypingStatus = (currentUserId: string, userId: string) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!currentUserId || !userId) return;

    const chatId = [currentUserId, userId].sort().join("_");
    const typingRef = doc(db, "chats", chatId, "typingStatus", userId);

    const unsub = onSnapshot(typingRef, (snap) => {
      setIsTyping(snap.data()?.isTyping === true);
    });

    return () => unsub();
  }, [currentUserId, userId]);

  return isTyping;
};
