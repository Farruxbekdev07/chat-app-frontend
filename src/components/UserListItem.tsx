"use client";

import {
  Box,
  Badge,
  Avatar,
  ListItem,
  Typography,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { UserWithLastMessage } from "src/hooks/users";
import { useOnlineStatus, useTypingStatus } from "src/hooks/useUserStatus";

const UserListItem = ({
  user,
  selected,
  onSelect,
  currentUserId,
}: {
  selected: boolean;
  user: UserWithLastMessage;
  onSelect: () => void;
  currentUserId: string;
}) => {
  const isOnline = useOnlineStatus(user.uid);
  const isTyping = useTypingStatus(currentUserId, user.uid);

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onSelect}
        sx={{
          bgcolor: selected ? "action.selected" : "inherit",
          "&:hover": {
            bgcolor: selected ? "action.selected" : "action.hover",
          },
        }}
      >
        <ListItemAvatar>
          <Badge
            overlap="circular"
            variant="dot"
            invisible={!isOnline}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#44b700",
                boxShadow: "0 0 0 2px white",
              },
            }}
          >
            <Avatar>{user.fullName?.[0]}</Avatar>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2">{user.fullName}</Typography>
              {user.lastMessage?.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(user.lastMessage.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </Typography>
              )}
            </Box>
          }
          secondary={
            isTyping ? (
              <Typography variant="body2" color="primary">
                typing...
              </Typography>
            ) : (
              user.lastMessage?.text && (
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      noWrap
                      variant="body2"
                      color="textSecondary"
                      sx={{ maxWidth: 160 }}
                    >
                      {user?.lastMessage?.imageUrl
                        ? "Photo"
                        : user.lastMessage.text.length > 30
                        ? user.lastMessage.text.slice(0, 30) + "…"
                        : user.lastMessage.text}
                    </Typography>

                    {user.lastMessage?.senderId === currentUserId ? (
                      user.lastMessage?.seenBy?.length > 1 ? (
                        <DoneAllIcon
                          fontSize="small"
                          sx={{ color: "#2196f3", ml: 1 }}
                        />
                      ) : (
                        <CheckIcon fontSize="small" sx={{ ml: 1 }} />
                      )
                    ) : null}
                  </Box>

                  {user.unreadCount > 0 && (
                    <Box mt={0.5} display="flex" justifyContent="flex-end">
                      <Badge
                        badgeContent={user.unreadCount}
                        color="primary"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.65rem",
                            minWidth: 18,
                            height: 18,
                            padding: "0 6px",
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )
            )
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default UserListItem;
