"use client";

// packages
import {
  List,
  Drawer,
  Avatar,
  ListItem,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

// constants
import { chats } from "src/constants/data";

// styles
import { DrawerContainer } from "src/styles/Sidebar";

const Sidebar = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/login");
  };

  return (
    <DrawerContainer>
      <Drawer className="drawer" variant="permanent" anchor="left">
        <List>
          {chats.map(({ id, person, primary, secondary }) => (
            <ListItem disablePadding key={id}>
              <ListItemButton onClick={handleNavigate}>
                <ListItemAvatar>
                  {person ? (
                    <Avatar alt="Profile Picture" src={person} />
                  ) : (
                    <Avatar>{primary.slice(0, 1)}</Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={primary}
                  secondary={
                    <Typography noWrap variant="body2" color="textSecondary">
                      {secondary}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </DrawerContainer>
  );
};

export default Sidebar;
