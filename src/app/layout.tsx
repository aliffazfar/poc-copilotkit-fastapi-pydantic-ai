import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jom Kira | AI-Powered Digital Banking",
  description: "Experience the future of banking with Jom Kira - Your intelligent digital banking assistant. Transfer money, pay bills, and manage your finances with AI.",
  keywords: ["digital banking", "AI banking", "Malaysia bank", "fintech", "mobile banking"],
  authors: [{ name: "Jom Kira Team" }],
  openGraph: {
    title: "Jom Kira | AI-Powered Digital Banking",
    description: "Experience the future of banking with Jom Kira - Your intelligent digital banking assistant.",
    type: "website",
    locale: "en_MY",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#771FFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans flex justify-center min-h-screen">
        <div className="w-full max-w-[430px] bg-[#F2F5F9] min-h-screen relative shadow-2xl md:my-8 md:min-h-[calc(100vh-4rem)] md:rounded-[15px] overflow-hidden">
          <CopilotKit runtimeUrl="/api/copilotkit" agent="jom_kira_agent">
            {children}
          </CopilotKit>
        </div>
      </body>
    </html>
  );
}
