import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { UsernameProvider } from "./context/UsernameContext";

export const metadata: Metadata = {
  title: "Share a Dish",
  description: "Share meals with friends and neighbours",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased min-h-screen">
        <UsernameProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </UsernameProvider>
      </body>
    </html>
  );
}
