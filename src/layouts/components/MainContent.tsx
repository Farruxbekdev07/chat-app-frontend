import { AppBar, Box, useMediaQuery } from "@mui/material";

import theme from "src/theme";
import Header from "src/components/Header";
import { DRAWER_WIDTH } from "src/constants";
import ChatWindow from "src/components/ChatWindow";

const MainContent = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: { sm: `calc(100% - ${isMobile ? 0 : DRAWER_WIDTH}px)` },
      }}
    >
      <AppBar
        position="static"
        sx={{
          width: "100%",
        }}
      >
        <Header />
      </AppBar>

      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          height: "calc(100% - 64px)",
          background: `url(./background.png) center center / cover no-repeat`,
        }}
      >
        <ChatWindow />
      </Box>
    </Box>
  );
};

export default MainContent;
