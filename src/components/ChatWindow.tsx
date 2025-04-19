"use client";

// packages
import React from "react";

// components
import Header from "./Header";
import ChatInput from "./ChatInput";
import ChatMessage from "./MessageBubble";
import { ChatContainer, MessagesContainer } from "src/styles/Chat";

// data
import { messages } from "src/constants/data";

const ChatWindow = () => {
  const handleSendMessage = (message: string) => {
    console.log("Sended message:", message);
  };

  return (
    <ChatContainer>
      <Header name="John Doe" />
      <MessagesContainer>
        {messages?.map(({ id, text, avatar, isOwnMessage }) => (
          <ChatMessage
            key={id}
            text={text}
            avatar={avatar}
            isOwnMessage={isOwnMessage}
          />
        ))}
      </MessagesContainer>
      <ChatInput onSend={handleSendMessage} />
    </ChatContainer>
  );
};

export default ChatWindow;
