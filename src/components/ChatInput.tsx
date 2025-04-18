"use client";

// packages
import {
  Box,
  Paper,
  Popover,
  InputBase,
  IconButton,
  Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { styled } from "@mui/material/styles";
import { Send, AttachFile, EmojiEmotions, Close } from "@mui/icons-material";
import { ChatInputWrapper } from "src/styles/Chat";

const ChatInput = ({
  onSend,
}: {
  onSend: (message: string, file?: File | null) => void;
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() || file) {
      onSend(message, file);
      setMessage("");
      setFile(null);
    }
  };

  const handleEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ position: "relative", padding: "10px" }}>
      {/* 📎 Fayl yuklanganini ko‘rsatish */}
      {file && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "5px",
            borderRadius: "10px",
            // background: "#f0f0f0",
            position: "absolute",
            bottom: "60px",
            left: "10px",
            boxShadow: 1,
          }}
        >
          <Typography variant="body2">{file.name}</Typography>
          <IconButton size="small" onClick={() => setFile(null)}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* 📎 Fayl yuklash */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />
        <IconButton
          color="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <AttachFile />
        </IconButton>

        {/* ✍️ Input field */}
        <ChatInputWrapper>
          <InputBase
            fullWidth
            value={message}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Xabar yozing..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />

          {/* 😃 Emoji tugmasi */}
          <IconButton
            color="primary"
            onClick={(e) => setEmojiAnchor(e.currentTarget)}
          >
            <EmojiEmotions />
          </IconButton>
        </ChatInputWrapper>

        {/* 📤 Yuborish tugmasi */}
        {(message.trim() || file) && (
          <IconButton color="primary" onClick={handleSendMessage}>
            <Send />
          </IconButton>
        )}
      </Box>

      {/* 😃 Emoji picker modal */}
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
