"use client";

// packages
import {
  List,
  Avatar,
  ListItem,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";

// constants
import { useUsersWithLastMessage } from "src/hooks/users";
import { setSelectedUser } from "src/redux/messagesSlice";

const Sidebar = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const dispatch = useDispatch();

  const users = useUsersWithLastMessage();
  console.log("users", users);

  const handleNavigate = (user: {
    uid: string;
    fullName: string;
    username: string;
  }) => {
    dispatch(setSelectedUser(user));
    setOpen(false);
  };

  return (
    <List>
      {users.map(({ uid, fullName, lastMessage, image, username }) => (
        <ListItem disablePadding key={uid}>
          <ListItemButton
            onClick={() => handleNavigate({ uid, fullName, username })}
          >
            <ListItemAvatar>
              {image ? (
                <Avatar alt="Profile Picture" src={image} />
              ) : (
                <Avatar>{fullName.slice(0, 1)}</Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={fullName}
              secondary={
                <Typography noWrap variant="body2" color="textSecondary">
                  {lastMessage?.text
                    ? lastMessage.text.slice(0, 30) + `…`
                    : "No messages yet"}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
