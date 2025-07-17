"use client";

import {
  Box,
  Drawer,
  useTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { RootState } from "src/redux/store";
import Sidebar from "src/components/Sidebar";
import { DRAWER_WIDTH } from "src/constants";
import MainContent from "./components/MainContent";

const DashboardLayout = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const selectedUser = useSelector(
    (state: RootState) => state.message.selectedUser
  );

  useEffect(() => {
    setMobileOpen(Boolean(selectedUser));
  }, [selectedUser]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      <Box
        component="nav"
        sx={{
          width: isMobile ? "100%" : DRAWER_WIDTH,
        }}
      >
        <Sidebar />
      </Box>

      {isMobile ? (
        <Drawer
          anchor="right"
          open={mobileOpen}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "100%",
            },
          }}
        >
          <MainContent />
        </Drawer>
      ) : (
        <MainContent />
      )}
    </Box>
  );
};

export default DashboardLayout;
