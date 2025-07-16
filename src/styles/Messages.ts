import { Box, styled } from "@mui/material";
import { MessageProps } from "src/types/message";

export const MessageWrapper = styled(Box)({
  gap: "8px",
  display: "flex",
  marginBottom: "10px",
  alignItems: "flex-end",
});

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOwnMessage",
})<MessageProps>(({ theme, isOwnMessage }) => ({
  maxWidth: "50%",
  fontSize: "14px",
  minWidth: "150px",
  position: "relative",
  padding: "10px 15px",
  wordBreak: "break-word",
  backgroundColor: isOwnMessage
    ? theme.palette.primary.main
    : theme.palette.grey[800],
  alignSelf: isOwnMessage ? "flex-end" : "flex-start",
  color: isOwnMessage ? "#fff" : theme.palette.text.primary,
  borderRadius: isOwnMessage ? "15px 15px 5px 15px" : "15px 15px 15px 5px",
}));
