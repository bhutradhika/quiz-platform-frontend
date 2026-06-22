import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizMaster",
  description: "Test your knowledge with our interactive quizzes",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          containerStyle={{ zIndex: 99999 }}
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              maxWidth: "500px",
              pointerEvents: "none",
            },
            success: {
              style: {
                background: "#D6F2E3",
                color: "#13955E",
              },
            },
            error: {
              style: {
                background: "#F8E2E2",
                color: "#D03838",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
