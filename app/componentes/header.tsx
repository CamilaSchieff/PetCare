"use client";

import Link from "next/link";
import { useState } from "react";
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

interface HeaderProps {
  user?: {
    tipo?: "tutor" | "veterinario";
    [key: string]: any;
  } | null;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full bg-[#F4EEDF] border-b border-black/5 
        px-6 md:px-12 py-5 flex justify-between items-center z-50
        ${poppins.className}
      `}
    >
 
      <Link
        href="/"
        className={`${chewy.className} text-3xl font-bold text-[#FF7F50]`}
        style={{ textShadow: "2px 2px 10px rgba(0, 0, 0, 0.19)" }}
      >
        PetCare+
      </Link>

      <button
        className="md:hidden p-2 rounded-xl hover:bg-black/10 transition"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <nav
        className={`
          flex flex-col md:flex-row md:flex md:static
          gap-6 items-start md:items-center text-lg text-black
          fixed md:relative top-20 right-0 bg-[#F4EEDF]
          w-2/3 md:w-auto h-screen md:h-auto shadow-md md:shadow-none
          p-8 md:p-0 transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >

        {!user && (
          <>
            <Link
              href="/login"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>

            <Link
              href="/cadastro"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Criar Conta
            </Link>
          </>
        )}

        {user?.tipo === "tutor" && (
          <>
            <Link
              href="/tutor/home"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Início
            </Link>

            <Link
              href="/tutor/perfil"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Perfil
            </Link>

            <Link
              href="/tutor/historico"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Histórico
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="hover:text-[#ff7f50] transition"
            >
              Sair
            </button>
          </>
        )}

        {user?.tipo === "veterinario" && (
          <>
            <Link
              href="/vet/home"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Início
            </Link>

            <Link
              href="/vet/consulta\[id]"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Registrar Atendimento
            </Link>

            <Link
              href="/vet/historico"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Histórico
            </Link>

            <Link
              href="/vet/perfil"
              className="hover:text-[#ff7f50] transition"
              onClick={() => setOpen(false)}
            >
              Perfil
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="hover:text-[#ff7f50] transition"
            >
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
}