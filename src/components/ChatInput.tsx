"use client";

import React, { useState, useRef } from "react";
import { Box, IconButton, InputBase, Typography, Popover } from "@mui/material";
import { Send, AttachFile, EmojiEmotions, Close } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { ChatInputWrapper } from "src/styles/Chat";

interface Props {
  onSend: (message: string, file?: File | null) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed && !file) return;

    onSend(trimmed, file);
    setMessage("");
    setFile(null);
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + (emojiData.emoji || ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <Box sx={{ position: "relative", p: 1.5 }}>
      {/* Show selected file preview */}
      {file && (
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            left: 16,
            bgcolor: "#f5f5f5",
            px: 2,
            py: 1,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: 1,
          }}
        >
          <Typography fontSize={14}>{file.name}</Typography>
          <IconButton size="small" onClick={() => setFile(null)}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Attach File */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />
        <IconButton
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
        >
          <AttachFile />
        </IconButton>

        {/* Input & Emoji */}
        <ChatInputWrapper>
          <InputBase
            fullWidth
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            sx={{ px: 1 }}
          />
          <IconButton
            color="primary"
            onClick={(e) => setEmojiAnchor(e.currentTarget)}
            aria-label="Add emoji"
          >
            <EmojiEmotions />
          </IconButton>
        </ChatInputWrapper>

        {/* Send Button */}
        {(message.trim() || file) && (
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            aria-label="Send message"
          >
            <Send />
          </IconButton>
        )}
      </Box>

      {/* Emoji Picker */}
      <Popover
        anchorEl={emojiAnchor}
        open={Boolean(emojiAnchor)}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>
    </Box>
  );
};

export default ChatInput;
