"use client";

// packages
import { ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

// next
import { Geist, Geist_Mono } from "next/font/google";

// local
import "./globals.css";
import theme from "src/theme";

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
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
