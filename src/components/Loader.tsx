// src/components/Loader.tsx
import { Box, CircularProgress } from "@mui/material";

import theme from "src/theme";

const Loader = () => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `${theme.palette.background.default}`,
    }}
  >
    <CircularProgress />
  </Box>
);

export default Loader;
