import type { Metadata } from "next";
import "./globals.css";

import { Montserrat } from "next/font/google";

const roboto = Montserrat({
  variable: "--montserrat-font",
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Time",
  description:
    "Quiz Time App developed spicial for Danil Antonchik by Saveliev Oleksandr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <div className="flex min-h-screen flex-col max-w-screen-xl mx-auto">
          <h1
            className="text-5xl font-black text-center uppercase
       my-4"
          >
            Quiz Time
          </h1>
          <div className="px-3">{children}</div>
        </div>
      </body>
    </html>
  );
}
