import { createTheme, ThemeOptions } from "@mui/material/styles";

const primaryColor = "#1E88E5"; // Blue
const secondaryColor = "#FFC107"; // Amber
const backgroundDark = "#121212";
const backgroundLight = "#ffffff";

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: "Inter, sans-serif",
    body1: {
      fontSize: "1rem",
    },
    h5: {
      fontWeight: "bold",
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          padding: "12px 20px",
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "16px",
        },
      },
    },
  },
};

// Light Theme
export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "light",
    primary: { main: primaryColor },
    secondary: { main: secondaryColor },
    background: { default: backgroundLight, paper: "#f5f5f5" },
    text: { primary: "#212121", secondary: "#757575" },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    secondary: { main: secondaryColor },
    background: { default: backgroundDark, paper: "#1E1E1E" },
    text: { primary: "#ffffff", secondary: "#B0BEC5" },
  },
});
