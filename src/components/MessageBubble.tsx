import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

interface MessageProps {
  isOwnMessage: boolean;
}

const MessageWrapper = styled(Box)({
  gap: "8px",
  display: "flex",
  marginBottom: "10px",
  alignItems: "flex-end",
});

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOwnMessage",
})<MessageProps>(({ theme, isOwnMessage }) => ({
  maxWidth: "75%",
  fontSize: "14px",
  position: "relative",
  padding: "10px 15px",
  wordBreak: "break-word",
  backgroundColor: isOwnMessage
    ? theme.palette.primary.main
    : theme.palette.grey[800],
  alignSelf: isOwnMessage ? "flex-end" : "flex-start",
  color: isOwnMessage ? "#fff" : theme.palette.text.primary,
  borderRadius: isOwnMessage ? "15px 15px 5px 15px" : "15px 15px 15px 5px",

  "&::after": {
    width: 0,
    height: 0,
    bottom: 0,
    content: '""',
    position: "absolute",
    borderStyle: "solid",
    [isOwnMessage ? "right" : "left"]: "-10px",
    // borderWidth: isOwnMessage ? "10px 0 0 10px" : "10px 10px 0 0",
    borderColor: isOwnMessage
      ? `${theme.palette.primary.main} transparent transparent transparent`
      : `${theme.palette.grey[800]} transparent transparent transparent`,
  },
}));

const ChatMessage = ({
  text,
  avatar,
  isOwnMessage,
}: {
  text: string;
  isOwnMessage: boolean;
  avatar: string;
}) => {
  return (
    <MessageWrapper
      style={{
        flexDirection: isOwnMessage ? "row-reverse" : "row",
      }}
    >
      <Avatar src={avatar} alt="User Avatar" sx={{ width: 32, height: 32 }} />
      <MessageBubble isOwnMessage={isOwnMessage}>{text}</MessageBubble>
    </MessageWrapper>
  );
};

export default ChatMessage;
