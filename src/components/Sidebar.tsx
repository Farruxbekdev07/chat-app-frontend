"use client";

import {
  Box,
  List,
  Badge,
  Avatar,
  Divider,
  ListItem,
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  IconButton,
  Drawer,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState, useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDispatch, useSelector } from "react-redux";
import { Logout, Close as CloseIcon } from "@mui/icons-material";
import { green } from "@mui/material/colors";

import { RootState } from "src/redux/store";
import { clearSelectedUser, setSelectedUser } from "src/redux/messagesSlice";
import { useUsersWithLastMessage, useAllUsers } from "src/hooks/users";
import { formatDistanceToNow } from "date-fns";
import { pxToRem } from "src/utils";
import { DRAWER_WIDTH } from "src/constants";
import { logout } from "src/redux/authSlice";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "src/hooks/useUserStatus";
import UserListItem from "./UserListItem";

const Sidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );

  const recentUsers = useUsersWithLastMessage();
  const allUsers = useAllUsers();

  const handleNavigate = (user: {
    uid: string;
    fullName: string;
    username: string;
  }) => {
    setSearchTerm("");
    dispatch(setSelectedUser(user));
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];

    const lower = searchTerm.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.uid !== currentUser?.uid &&
        (u.fullName.toLowerCase().includes(lower) ||
          u.username.toLowerCase().includes(lower))
    );
  }, [searchTerm, allUsers, currentUser]);

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleLogout = () => {
    router.push("/login");
    setOpenDrawer(false);
    dispatch(logout());
    dispatch(clearSelectedUser());
  };

  const shouldShowSearchResults = searchTerm.trim().length > 0;

  return (
    <Box sx={{ overflow: "auto", height: "100%", width: "100%" }}>
      <Box
        sx={{
          gap: pxToRem(8),
          height: "64px",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton onClick={handleToggleDrawer}>
          <MenuIcon />
        </IconButton>
        <TextField
          placeholder="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Divider />

      <List>
        {(shouldShowSearchResults ? filteredUsers : recentUsers)
          .filter((u) => u.uid !== currentUser?.uid)
          .map((user) => (
            <UserListItem
              key={user.uid}
              user={user}
              currentUserId={currentUser?.uid || ""}
              selected={selectedUser?.uid === user.uid}
              onSelect={() =>
                handleNavigate({
                  uid: user.uid,
                  fullName: user.fullName,
                  username: user.username,
                })
              }
            />
          ))}
      </List>

      {!shouldShowSearchResults &&
        recentUsers.filter((u) => u.uid !== currentUser?.uid).length === 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ margin: 4 }}
          >
            You haven't corresponded with anyone yet. Find a new user using the
            search.
          </Typography>
        )}

      <Drawer
        anchor="left"
        open={openDrawer}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        onClose={() => setOpenDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {/* Yuqori qism */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
          >
            <Typography variant="h6">Profile</Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box textAlign="center" mb={2}>
            <Avatar sx={{ width: 72, height: 72, margin: "0 auto" }}>
              {currentUser?.displayName?.[0]}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={600} mt={1}>
              {currentUser?.displayName || "No Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{currentUser?.username || "username"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Pastki qism: Logout */}
        <Box p={2}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
