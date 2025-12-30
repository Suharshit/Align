import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Align",
  description: "Align - The Future of Work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-us" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/alignIconLight.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
