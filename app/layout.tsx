import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyType - Form Builder",
  description: "Beautiful one-question-at-a-time forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
