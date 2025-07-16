"use client";

import { createTheme } from "@mui/material/styles";
import { pxToRem } from "./utils";

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0088cc",
    },
    background: {
      default: "#1e1e1e",
      paper: "#232323",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    divider: "#2f2f2f",
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    allVariants: {
      color: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          backgroundColor: "#232323",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#232323",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: pxToRem(8),
          textTransform: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          borderRadius: pxToRem(8),
          backgroundColor: "#2b2b2b",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          background: "#232323",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          display: "flex",
          width: pxToRem(300),
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
    },
  },
});

const theme = {
  ...baseTheme,
  customColors: {
    primaryLight: "#bbdefb", // bu sizga kerakli custom color
  },
};

export default theme;
