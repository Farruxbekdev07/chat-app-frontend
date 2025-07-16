import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  text: string;
  edited: boolean;
  seenBy: string[];
  senderId: string;
  imageUrl?: string;
  fullName?: string;
  senderName: string;
  createdAt: Timestamp;
}

export interface MessageProps {
  isOwnMessage: boolean;
}
