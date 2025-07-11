"use client";

// packages
import React from "react";

// components
import ChatInput from "./ChatInput";
import ChatMessage from "./MessageBubble";
import { ChatContainer, MessagesContainer } from "src/styles/Chat";

// data
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { useChatMessages, useSendMessage } from "src/hooks/useMessages";

const ChatWindow = () => {
  const messages = useChatMessages();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const sendMessage = useSendMessage();

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages?.length === 0 && (
          <div className="no-messages">No messages yet</div>
        )}
        {messages?.map(({ senderId, text, fullName }) => (
          <ChatMessage
            text={text}
            avatar={""}
            key={senderId}
            fullName={fullName || ""}
            isOwnMessage={senderId === currentUser?.uid}
          />
        ))}
      </MessagesContainer>
      <ChatInput onSend={handleSendMessage} />
    </ChatContainer>
  );
};

export default ChatWindow;
