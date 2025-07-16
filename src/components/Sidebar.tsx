"use client";

import {
  Box,
  List,
  Avatar,
  Drawer,
  Divider,
  ListItem,
  TextField,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logout, Close as CloseIcon } from "@mui/icons-material";

import { pxToRem } from "src/utils";
import UserListItem from "./UserListItem";
import { RootState } from "src/redux/store";
import { useRouter } from "next/navigation";
import { logout, setLoading } from "src/redux/authSlice";
import { useUsersWithLastMessage, useAllUsers } from "src/hooks/users";
import { clearSelectedUser, setSelectedUser } from "src/redux/messagesSlice";

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
    dispatch(setLoading(true));
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
          display: "flex",
          height: pxToRem(64),
          padding: pxToRem(4),
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
            You have not corresponded with anyone yet. Find a new user using the
            search.
          </Typography>
        )}

      <Drawer
        anchor="left"
        open={openDrawer}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        onClose={() => setOpenDrawer(false)}
      >
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
