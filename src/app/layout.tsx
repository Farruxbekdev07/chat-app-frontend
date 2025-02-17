"use client";
import { Provider } from "react-redux";

import "./globals.css";
import { store } from "src/store/store";
import { ThemeProviderWrapper } from "src/theme/themeProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </Provider>
      </body>
    </html>
  );
}
