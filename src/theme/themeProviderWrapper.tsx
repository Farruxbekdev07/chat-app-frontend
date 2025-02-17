"use client";

import { useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { RootState } from "src/store/store";
import { lightTheme, darkTheme } from "./theme";

export const ThemeProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
