"use client";
import Link from "next/link";

export default function Header({
  user,
  onLogout,
}: {
  user: any;
  onLogout?: () => void;
}) {
  return (
    <header
      className="
        fixed top-0 left-0 w-full 
        bg-[#F4EEDF] border-b border-black/5 
        px-6 md:px-12 py-5 
        flex justify-between items-center 
        z-50
      "
    >
      {/* LOGO */}
      <Link href="/" className="text-3xl font-bold text-[#FF7F50]">
        PetCare+
      </Link>

      {/* MENU */}
      <nav className="flex gap-6 items-center text-lg text-black">
        {!user && (
          <>
            <Link href="/login" className="hover:text-[#ff7f50] transition">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="hover:text-[#ff7f50] transition"
            >
              Criar Conta
            </Link>
          </>
        )}

        {user && user.tipo === "tutor" && (
          <>
            <Link href="/tutor/home" className="hover:text-[#ff7f50] transition">
              Início
            </Link>
            <Link
              href="/tutor/historico"
              className="hover:text-[#ff7f50] transition"
            >
              Histórico
            </Link>
            <button
              onClick={onLogout}
              className="hover:text-[#ff7f50] transition"
            >
              Sair
            </button>
          </>
        )}

        {user && user.tipo === "veterinario" && (
          <>
            <Link href="/vet/home" className="hover:text-[#ff7f50] transition">
              Agenda
            </Link>
            <Link
              href="/vet/historico"
              className="hover:text-[#ff7f50] transition"
            >
              Histórico
            </Link>
            <button
              onClick={onLogout}
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