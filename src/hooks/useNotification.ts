// src/hooks/useNotification.ts
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "src/firebase/config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export const useNotification = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    const notifRef = doc(db, "notifications", userId);

    const unsub = onSnapshot(notifRef, async (snap) => {
      const data = snap.data();
      if (!data) return;

      const { message, read } = data;

      if (message && !read) {
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
        });

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
