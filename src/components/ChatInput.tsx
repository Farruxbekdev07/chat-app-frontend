"use client";

import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Box, IconButton, InputBase, Popover } from "@mui/material";
import { Send, AttachFile, EmojiEmotions, Save } from "@mui/icons-material";

import { db } from "src/firebase/config";
import { RootState } from "src/redux/store";
import { ChatInputWrapper } from "src/styles/Chat";
import { uploadToImgBB } from "src/utils/uploadImage";
import ImagePreviewModal from "src/components/ImagePreviewModal";

interface MessageType {
  id: string;
  text: string;
  imageUrl?: string;
}

interface Props {
  onCancelEdit?: () => void;
  editingMessage?: MessageType | null;
  onSend: (message: string, imageUrl?: string) => void;
  onEdit?: (messageId: string, newText: string, newImageUrl?: string) => void;
}

const ChatInput = ({ onSend, onEdit, editingMessage, onCancelEdit }: Props) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );

  useEffect(() => {
    if (editingMessage?.imageUrl && !editingMessage.text) {
      fileInputRef.current?.click();
    } else if (editingMessage) {
      setMessage(editingMessage.text || "");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [editingMessage]);

  const sendTypingStatus = debounce(async (isTyping: boolean) => {
    if (!user || !selectedUser) return;
    const chatId = [user.uid, selectedUser.uid].sort().join("_");
    const ref = doc(db, "chats", chatId, "typingStatus", user.uid);
    await setDoc(ref, { isTyping }, { merge: true });
  }, 300);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Faqat rasm fayllarini tanlang!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
      setFile(selectedFile);
      setShowImageModal(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleImageUpload = async () => {
    if (!file) return;

    const url = await uploadToImgBB(file);
    if (!url) {
      toast.error("Rasm yuklanmadi");
      return;
    }

    if (editingMessage && onEdit) {
      onEdit(editingMessage.id, editingMessage.text || "", url);
      toast.success("Image updated successfully!");
      onCancelEdit?.();
    } else {
      onSend("", url);
      toast.success("Image sended successfully!");
    }

    setFile(null);
    setImagePreviewUrl(null);
    setShowImageModal(false);
  };

  const handleSendMessage = async () => {
    const trimmed = message.trim();

    if (editingMessage && onEdit) {
      const textChanged = trimmed !== editingMessage.text;
      const imageChanged = Boolean(file);

      if (!textChanged && !imageChanged) {
        toast.info("Hech qanday o'zgarish yo'q");
        return;
      }

      if (imageChanged && file) {
        const uploadedUrl = await uploadToImgBB(file);
        if (uploadedUrl) {
          onEdit(editingMessage.id, trimmed, uploadedUrl);
        } else {
          toast.error("Rasm yuklanmadi");
        }
      } else {
        onEdit(editingMessage.id, trimmed, editingMessage.imageUrl);
      }

      setMessage("");
      onCancelEdit?.();
      setFile(null);
      setImagePreviewUrl(null);
      return;
    }

    if (!trimmed) return;

    onSend(trimmed);
    setMessage("");
    setFile(null);
    sendTypingStatus(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
    if (e.key === "Escape" && editingMessage) onCancelEdit?.();
  };

  return (
    <Box sx={{ position: "relative", p: 1.5, background: "transparent" }}>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
        accept="image/*"
      />

      <Box
        sx={{
          gap: 1,
          display: "flex",
          alignItems: "center",
          background: "transparent",
        }}
      >
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <AttachFile />
        </IconButton>

        <ChatInputWrapper>
          <InputBase
            fullWidth
            inputRef={inputRef}
            placeholder={
              editingMessage ? "Edit message..." : "Write a message..."
            }
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              sendTypingStatus(Boolean(e.target.value));
            }}
            onKeyDown={handleKeyDown}
            sx={{ px: 1 }}
          />
          <IconButton onClick={(e) => setEmojiAnchor(e.currentTarget)}>
            <EmojiEmotions />
          </IconButton>
        </ChatInputWrapper>

        {(message.trim() || file) && (
          <IconButton onClick={handleSendMessage} color="primary">
            {editingMessage ? <Save /> : <Send />}
          </IconButton>
        )}
      </Box>

      <Popover
        anchorEl={emojiAnchor}
        open={Boolean(emojiAnchor)}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
      </Popover>

      <ImagePreviewModal
        open={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setFile(null);
          setImagePreviewUrl(null);
        }}
        onSend={handleImageUpload}
        imageUrl={imagePreviewUrl}
        title={editingMessage ? "Edit Image" : "Send Image"}
        confirmLabel={editingMessage ? "Save" : "Send"}
      />
    </Box>
  );
};

export default ChatInput;
