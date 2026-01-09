import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FairHire - Transparent Internship & Job Platform",
  description: "Find internships and jobs with transparency and fairness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
