"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/componentes/header";
import { addPet } from "@/app/lib/api";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
});

export default function AdicionarPet() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const pc =
    typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = () => setFotoBase64(String(reader.result));
    reader.readAsDataURL(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const payload = {
        tutorId: user.id,
        nome,
        especie,
        raca,
        idade: Number(idade),
        observacoes,
        foto: fotoBase64 || "",
        status: "ativo",
      };

      await addPet(payload);
      setMsg("Pet adicionado com sucesso!");
      setTimeout(() => router.push("/tutor/home"), 800);
    } catch (err) {
      console.error(err);
      setMsg("Erro ao adicionar pet.");
    }
  }

  return (
    <>
      <Header
        user={user}
        onLogout={() => {
          localStorage.removeItem("pc_user");
          router.push("/login");
        }}
      />

      <main className="min-h-screen bg-[#106944] pt-28 flex justify-center px-6">

        <div className="w-full max-w-3xl">
          <h1 className={`${poppins.className} text-3xl font-bold text-[#FAF3E0] mb-6`}>
            Cadastrar Pet
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-[#FFF5EC] p-6 rounded-3xl shadow-lg"
          >
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              className="w-full p-3 border border-gray-300 rounded-xl placeholder-gray-400"
            />

            <input
              required
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
              placeholder="Espécie"
              className="w-full p-3 border border-gray-300 rounded-xl text-[#065F3A] placeholder-gray-400"
            />

            <input
              value={raca}
              onChange={(e) => setRaca(e.target.value)}
              placeholder="Raça"
              className="w-full p-3 border border-gray-300 rounded-xl text-[#065F3A] placeholder-gray-400"
            />

            <input
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Idade (anos)"
              className="w-full p-3 border border-gray-300 rounded-xl text-[#065F3A] placeholder-gray-400"
            />

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações médicas"
              className="w-full p-3 border border-gray-300 rounded-xl text-[#065F3A] placeholder-gray-400"
            />

            <div>
              <label className="block mb-2 font-semibold text-[#065F3A]">
                Foto do pet
              </label>

              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-green-700 text-white rounded-xl cursor-pointer hover:bg-green-800 transition"
              >
                Escolher arquivo
              </label>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />

              {!fotoBase64 && (
                <p className="text-sm text-gray-500 mt-1 italic">
                  nenhum arquivo selecionado{" "}
                  <span className="opacity-60">*</span>
                </p>
              )}

              {fotoBase64 && (
                <img
                  src={fotoBase64}
                  alt="preview"
                  className="mt-3 w-40 h-40 object-cover rounded-xl shadow-md"
                />
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition"
              >
                Salvar
              </button>
              <span className="ml-4 text-sm text-gray-700">{msg}</span>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}