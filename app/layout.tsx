import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const opensans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "owenchess",
  description: "owen's chess openings app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${opensans.variable} font-black h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
