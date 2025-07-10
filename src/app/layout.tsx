"use client";

// packages
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

// next
import { Geist, Geist_Mono } from "next/font/google";

// local
import "./globals.css";
import theme from "src/theme";
import { store } from "src/redux/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
            <ToastContainer />
          </MuiThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
