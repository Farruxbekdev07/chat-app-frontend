"use client";

// packages
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  AppBar,
  Toolbar,
  useTheme,
  Typography,
  IconButton,
  CssBaseline,
  useMediaQuery,
  Drawer,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

// components
import Sidebar from "src/components/Sidebar";
import ChatWindow from "src/components/ChatWindow";

// styles
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { logout } from "src/redux/authSlice";
import { useRouter } from "next/navigation";
import { clearSelectedUser } from "src/redux/messagesSlice";

const drawerWidth = 300;
const settings = ["Logout"];

const Dashboard = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state: RootState) => state.auth.user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
    dispatch(clearSelectedUser());
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isMobile ? 0 : drawerWidth}px)` },
          ml: { sm: `${isMobile ? 0 : drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              {selectedUser?.fullName || "My Chat App"}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={currentUser?.displayName || "User"}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="user list"
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={!selectedUser ? true : mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <Sidebar setOpen={setMobileOpen} />
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <Sidebar setOpen={setMobileOpen} />
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          {selectedUser ? (
            <ChatWindow />
          ) : (
            <Box
              sx={{
                height: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Please select a user
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
