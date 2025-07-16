import { Box, styled } from "@mui/material";
import { MessageProps } from "src/types/message";
import { pxToRem } from "src/utils";

export const MessageWrapper = styled(Box)({
  gap: pxToRem(8),
  display: "flex",
  marginBottom: pxToRem(10),
  alignItems: "flex-end",
});

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOwnMessage",
})<MessageProps>(({ theme, isOwnMessage }) => ({
  maxWidth: "50%",
  position: "relative",
  fontSize: pxToRem(14),
  minWidth: pxToRem(150),
  wordBreak: "break-word",
  padding: `${pxToRem(10)} ${pxToRem(15)}`,
  backgroundColor: isOwnMessage
    ? theme.palette.primary.main
    : theme.palette.grey[800],
  alignSelf: isOwnMessage ? "flex-end" : "flex-start",
  color: isOwnMessage ? "#fff" : theme.palette.text.primary,
  borderRadius: isOwnMessage ? "15px 15px 5px 15px" : "15px 15px 15px 5px",
}));
