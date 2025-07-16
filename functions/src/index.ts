import * as admin from "firebase-admin";
import { onValueUpdated } from "firebase-functions/v2/database";
import { logger } from "firebase-functions";

admin.initializeApp();

// 🔁 Realtime Database orqali foydalanuvchi holatini Firestore'ga sync qilish
export const onUserStatusChanged = onValueUpdated(
  "/status/{userId}",
  async (event) => {
    const status = event.data.after?.val();
    const uid = event.params.userId;

    if (!status) {
      logger.warn(`No status data for user ${uid}`);
      return;
    }

    const isOnline = status.state === "online";

    const userRef = admin.firestore().doc(`users/${uid}`);

    logger.info(`Setting isOnline=${isOnline} for user ${uid}`);

    await userRef.set(
      {
        isOnline,
        lastSeen: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
);
