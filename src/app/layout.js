"use client"; 
import { useState } from 'react';
import localFont from "next/font/local";
import "./globals.css";
import { Web3AuthProvider } from "../common/service/useWeb3Auth";
import { MembershipProvider } from "../common/service/useMembership";
// import { ChatProvider } from "@/common/service/useChat";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Tokyo Dome",
//   description: "Tokyo Dome",
// };

export default function RootLayout({ children }) {

  const [web3AuthNetwork, setWeb3AuthNetwork] = useState("mainnet");
  const [chain, setChain] = useState("polygon");

  return (
    <Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
      <MembershipProvider>
        {/* <ChatProvider> */}
          <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
              {children}
            </body>
          </html>
        {/* </ChatProvider> */}
      </MembershipProvider>
    </Web3AuthProvider>
  );
}