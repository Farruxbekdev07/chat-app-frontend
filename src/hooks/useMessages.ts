import { useEffect, useState } from "react";
import { subscribeToMessages } from "../firebase/firestore";

const useMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    return subscribeToMessages(setMessages);
  }, []);

  return messages;
};

export default useMessages;
