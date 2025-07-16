// ✅ MessageBubble component with edit/delete dropdown and edited label
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Timestamp } from "firebase/firestore";
import { formatTime } from "src/utils/formatTime";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { MessageBubble, MessageWrapper } from "src/styles/Messages";
import { pxToRem } from "src/utils";
import Image from "next/image";

interface Props {
  text: string;
  avatar: string;
  seenBy: string[];
  fullName: string;
  imageUrl?: string;
  isOwnMessage: boolean;
  createdAt?: Timestamp;
  isLastMessage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  edited?: boolean;
}

const ChatMessage = ({
  text,
  avatar,
  seenBy,
  imageUrl,
  fullName,
  createdAt,
  isOwnMessage,
  isLastMessage,
  onEdit,
  onDelete,
  edited,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MessageWrapper
      style={{ flexDirection: isOwnMessage ? "row-reverse" : "row" }}
    >
      {avatar ? (
        <Avatar alt="User Avatar" src={avatar} sx={{ width: 32, height: 32 }} />
      ) : (
        <Avatar>{fullName.slice(0, 1)}</Avatar>
      )}

      <MessageBubble
        isOwnMessage={isOwnMessage}
        style={{ position: "relative" }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="sent"
            width={500}
            height={300}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: pxToRem(10),
              marginBottom: text ? 8 : 4,
            }}
          />
        )}

        {text && <Box>{text}</Box>}

        {createdAt && (
          <Box
            sx={{
              gap: pxToRem(4),
              display: "flex",
              alignItems: "center",
              fontSize: pxToRem(14),
              marginTop: pxToRem(6),
              justifyContent: "flex-end",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {formatTime(createdAt)}
            {edited && (
              <span style={{ fontStyle: "italic", marginLeft: 6 }}>
                (edited)
              </span>
            )}
            {isOwnMessage &&
              isLastMessage &&
              (seenBy.length > 1 ? (
                <DoneAllIcon sx={{ fontSize: pxToRem(18), color: "white" }} />
              ) : (
                <CheckIcon sx={{ fontSize: pxToRem(18), color: "white" }} />
              ))}
          </Box>
        )}

        {isOwnMessage && (onEdit || onDelete) && (
          <>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ position: "absolute", top: 4, right: 4 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              {onEdit && (
                <MenuItem
                  onClick={() => {
                    onEdit();
                    handleMenuClose();
                  }}
                >
                  Edit
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem
                  onClick={() => {
                    onDelete();
                    handleMenuClose();
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </MessageBubble>
    </MessageWrapper>
  );
};

export default ChatMessage;
