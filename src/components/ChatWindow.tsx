import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import { db } from "src/firebase/config";
import ChatMessage from "./MessageBubble";
import { RootState } from "src/redux/store";
import ChatInput from "src/components/ChatInput";
import { ChatContainer, MessagesContainer } from "src/styles/Chat";
import { useChatMessages, useSendMessage } from "src/hooks/useMessages";
import { Timestamp } from "@google-cloud/firestore";

interface MessageType {
  id: string;
  text: string;
  edited?: boolean;
  senderId: string;
  imageUrl?: string;
  seenBy?: string[];
  senderName?: string;
  createdAt?: Timestamp;
}

const ChatWindow = () => {
  const messages = useChatMessages();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );
  const sendMessage = useSendMessage();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [editingMessage, setEditingMessage] = useState<MessageType | null>(
    null
  );

  const handleSendMessage = (message: string, imageUrl?: string) => {
    sendMessage(message, imageUrl);
  };

  const handleEditMessage = async (
    messageId: string,
    newText: string,
    newImageUrl?: string
  ) => {
    if (!currentUser || !selectedUser || !editingMessage) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
    const messageRef = doc(db, "chats", chatId, "messages", messageId);

    const textChanged = newText !== editingMessage.text;
    const imageChanged = newImageUrl !== editingMessage.imageUrl;

    if (textChanged || imageChanged) {
      await updateDoc(messageRef, {
        ...(textChanged && { text: newText }),
        ...(imageChanged && { imageUrl: newImageUrl }),
        edited: true,
      });
    }

    setEditingMessage(null);
  };

  useEffect(() => {
    if (!currentUser || !selectedUser || !messages.length) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");

    messages.forEach((msg) => {
      const isOwn = msg.senderId === currentUser.uid;
      const alreadySeen = msg.seenBy?.includes(currentUser.uid);

      if (!isOwn && !alreadySeen) {
        const messageRef = doc(db, "chats", chatId, "messages", msg.id);
        updateDoc(messageRef, {
          seenBy: arrayUnion(currentUser.uid),
        });
      }
    });
  }, [messages, currentUser, selectedUser]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ChatContainer>
      <MessagesContainer>
        {(messages.length === 0 || !selectedUser) && (
          <div className="no-messages">
            {selectedUser ? "No messages" : "Select a chat to start messaging"}
          </div>
        )}
        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderId === currentUser?.uid;
          const isLastMessage = index === messages.length - 1;

          const isDeleted = !msg.text && !msg.imageUrl;
          if (isDeleted) return null;

          return (
            <ChatMessage
              key={msg.id}
              text={msg.text}
              avatar={""}
              imageUrl={msg.imageUrl}
              seenBy={msg.seenBy || []}
              createdAt={msg.createdAt}
              fullName={msg.senderName || ""}
              isOwnMessage={isOwnMessage}
              isLastMessage={isLastMessage}
              onEdit={() =>
                setEditingMessage({
                  id: msg.id,
                  text: msg.text,
                  senderId: msg.senderId,
                  imageUrl: msg.imageUrl,
                })
              }
              onDelete={async () => {
                const chatId = [currentUser?.uid, selectedUser?.uid]
                  .sort()
                  .join("_");
                const messageRef = doc(db, "chats", chatId, "messages", msg.id);
                await updateDoc(messageRef, { text: "", imageUrl: "" });
              }}
              edited={msg.edited || false}
            />
          );
        })}
        <div ref={bottomRef} />
      </MessagesContainer>

      {selectedUser && (
        <ChatInput
          onSend={handleSendMessage}
          onEdit={handleEditMessage}
          editingMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
        />
      )}
    </ChatContainer>
  );
};

export default ChatWindow;
