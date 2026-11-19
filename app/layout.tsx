import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sissifier GPT Admin",
  description: "Sissifier GPT Administration Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#17131d",
              color: "#f4f2f7",
              border: "1px solid #29232f",
            },
          }}
        />
      </body>
    </html>
  );
}