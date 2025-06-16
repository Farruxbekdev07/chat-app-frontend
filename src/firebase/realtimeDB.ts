import { realtimeDB } from "./config";
import { ref, set, onValue } from "firebase/database";

export const sendMessageRTDB = (text: string, uid: string) => {
  const messageRef = ref(realtimeDB, `messages/${Date.now()}`);
  set(messageRef, {
    text,
    uid,
    createdAt: new Date().toISOString(),
  });
};

export const subscribeToMessagesRTDB = (
  callback: (messages: any[]) => void
) => {
  const messagesRef = ref(realtimeDB, "messages");
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? Object.values(data) : [];
    callback(messages);
  });
};
