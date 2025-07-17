// src/hooks/useUnreadCountsFromNotifications.ts
import { useEffect, useState } from "react";
import { db } from "src/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

export const useUnreadCountsFromNotifications = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!currentUser?.uid) return;

    const notifRef = doc(db, "notifications", currentUser.uid);

    const unsub = onSnapshot(notifRef, (snap) => {
      const data = snap.data();
      if (data?.unreadCounts) {
        setCounts(data.unreadCounts);
      } else {
        setCounts({});
      }
    });

    return () => unsub();
  }, [currentUser]);

  return counts;
};
