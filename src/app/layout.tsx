import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coach Dashboard - Tyler Wilks Running",
  description: "Coach admin dashboard for managing clients and training schedules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

