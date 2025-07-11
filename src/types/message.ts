export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: string;
  fullName?: string;
}
