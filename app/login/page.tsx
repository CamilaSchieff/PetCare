// src/app/login/page.tsx 
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/api";

export default function LoginPage() {
  const nav = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("tutor");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const user = await login(email, senha);

      // Se não encontrar o usuário (u == null)
      if (!user) {
        setErro("Conta não encontrada. Verifique seu e-mail e senha, ou crie uma conta.");
        return;
      }

      // Se encontrar, mas o TIPO estiver errado
      if (user.tipo !== tipo) {
        setErro(`Conta encontrada, mas você selecionou o perfil errado. Por favor, selecione "Sou ${user.tipo}".`);
        return;
      }

      // SALVA NO LOCALSTORAGE
      localStorage.setItem("pc_user", JSON.stringify(user));


      // REDIRECIONAMENTO
      if (user.tipo === "tutor") {
        nav.push("/tutor/home");
      } else {
        nav.push("/vet/home");
      }

    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
      console.error(err);
    }
  }

  return (
    <div className="h-screen bg-[#106944] flex items-center justify-center relative overflow-hidden p-4">

      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0d7d61] rounded-full blur-3xl opacity-50 -translate-x-24 -translate-y-20 hidden md:block" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0d7d61] rounded-full blur-3xl opacity-50 translate-x-24 translate-y-20 hidden md:block" />

      <div className="relative z-10 flex flex-col items-center">

        <h1 className="text-6xl font-extrabold tracking-wide mb-10">
          <span className="text-[#ff9900]">PetCare</span>
          <span className="text-white">+</span>
        </h1>

        <h2 className="text-white text-2xl font-bold mb-6 tracking-wider">
          FAÇA SEU LOGIN
        </h2>

        <form
          onSubmit={handleLogin}
          className="bg-[#ffece1] px-10 py-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col gap-5"
        >

          {/* Campo E-mail */}
          <div>
            <label className="text-sm text-gray-700 font-bold tracking-wide">E-MAIL</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-800 mt-1 outline-none focus:border-[#0b6b53] transition duration-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-bold tracking-wide">SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-800 mt-1 outline-none focus:border-[#0b6b53] transition duration-200"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-700 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value="tutor"
                checked={tipo === "tutor"}
                onChange={() => setTipo("tutor")}
                className="form-radio text-[#0b6b53]"
              />
              Sou tutor
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value="veterinario"
                checked={tipo === "veterinario"}
                onChange={() => setTipo("veterinario")}
                className="form-radio text-[#0b6b53]"
              />
              Sou veterinário
            </label>
          </div>

          {erro && (
            <div className="text-red-700 text-sm text-center font-medium bg-red-100 border border-red-300 p-3 rounded-lg mt-1">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0b6b53] text-white py-3 rounded-xl mt-2 text-center font-bold tracking-wider transition duration-300
              hover:bg-white 
              hover:text-[#0b6b53] 
              hover:border-2 hover:border-[#0b6b53] active:scale-[0.98]">
              FAZER LOGIN
          </button>

          <a href="/cadastro" className="text-center text-gray-700 text-sm underline hover:text-[#ff9900] transition">
            Ainda não é cadastrado? Cadastre!
          </a>
        </form>
      </div>
    </div>
  );
}
