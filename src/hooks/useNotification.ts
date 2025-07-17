// src/hooks/useNotification.ts
import { useEffect } from "react";
import { db } from "src/firebase/config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export const useNotification = (userId: string) => {
  useEffect(() => {
    if (!userId) return;

    const notifRef = doc(db, "notifications", userId);

    const unsub = onSnapshot(notifRef, async (snap) => {
      const data = snap.data();
      if (!data) return;

      const { message, read } = data;

      if (message && !read) {
        try {
          await updateDoc(notifRef, { read: true });
        } catch (err) {
          console.error("❌ Notificationni read=true qilishda xatolik:", err);
        }
      }
    });

    return () => unsub();
  }, [userId]);
};
