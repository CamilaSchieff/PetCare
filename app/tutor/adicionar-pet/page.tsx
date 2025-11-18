"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/componentes/header";
import { addPet } from "@/app/lib/api";

export default function AdicionarPet() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFotoBase64(String(reader.result));
    };
    reader.readAsDataURL(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    try {
      const payload = {
        tutorId: user.id,
        nome,
        especie,
        raca,
        idade: Number(idade),
        observacoes,
        foto: fotoBase64 || "",
        status: "ativo" // status ativo ou falecido
      };
      await addPet(payload);
      setMsg("Pet adicionado com sucesso!");
      setTimeout(() => router.push("/tutor/home"), 800);
    } catch (err) {
      setMsg("Erro ao adicionar pet.");
      console.error(err);
    }
  }

  return (
    <>
      <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
      <main className="max-w-3xl mx-auto pt-28 p-6">
        <h1 className="text-2xl font-bold mb-4">Adicionar Pet</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <input required value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" className="w-full p-2 border rounded" />
          <input required value={especie} onChange={e=>setEspecie(e.target.value)} placeholder="Espécie" className="w-full p-2 border rounded" />
          <input value={raca} onChange={e=>setRaca(e.target.value)} placeholder="Raça" className="w-full p-2 border rounded" />
          <input value={idade} onChange={e=>setIdade(e.target.value)} placeholder="Idade (anos)" className="w-full p-2 border rounded" />
          <textarea value={observacoes} onChange={e=>setObservacoes(e.target.value)} placeholder="Observações médicas" className="w-full p-2 border rounded" />
          <div>
            <label className="block mb-1">Foto do pet</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {fotoBase64 && <img src={fotoBase64} alt="preview" className="mt-2 w-40 h-40 object-cover rounded" />}
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Salvar</button>
            <span className="ml-4 text-sm text-gray-600">{msg}</span>
          </div>
        </form>
      </main>
    </>
  );
}