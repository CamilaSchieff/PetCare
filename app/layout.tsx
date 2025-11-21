"use client";

import "./globals.css";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/componentes/header";
import { Chewy } from "next/font/google";
import { Poppins } from "next/font/google";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  const pagesWithoutHeader = ["/", "/login", "/cadastro"];

  const showHeader = !pagesWithoutHeader.includes(pathname);
  

  useEffect(() => {
    const saved = localStorage.getItem("pc_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pc_user");
    window.location.href = "/login";
  };

  return (
    <html lang="pt-BR">
      <body className={showHeader ? "pt-28 bg-[#faf7f0] min-h-screen" : ""}>
        {showHeader && <Header user={user} onLogout={handleLogout} />}
        {children}
      </body>
    </html>
  );
}