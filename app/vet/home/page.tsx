// src/app/vet/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasByVet } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function VetHome() {
  const router = useRouter();
  const [vet, setVet] = useState<any>(null);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("pc_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setVet(parsed);

      getConsultasByVet(parsed.id)
        .then((data) => setConsultas(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!vet) return <p className="text-center mt-10">Nenhum veterinário logado.</p>;

  return (
    <>
      <Header
        user={vet}
        onLogout={() => {
          localStorage.removeItem("pc_user");
          router.push("/login");
        }}
      />

      {/* FUNDO VERDE + FORMAS DECORATIVAS */}
      <div className="min-h-screen w-full bg-[#065f46] pt-32 px-4 relative overflow-hidden">

        {/* Forma esquerda */}
        <div className="absolute top-10 left-0 w-96 h-96 bg-[#0b7a5c] opacity-30 rounded-full blur-3xl" />

        {/* Forma direita */}
        <div className="absolute top-32 right-0 w-96 h-96 bg-[#0b7a5c] opacity-30 rounded-full blur-3xl" />

        {/* CONTEÚDO PRINCIPAL */}
        <div className="relative z-10 max-w-4xl mx-auto">

          <h1 className="text-white text-3xl font-bold mb-8">CONSULTAS DO DIA</h1>

          {consultas.length === 0 ? (
            <div className="bg-[#FFF4EA] text-center p-6 rounded-2xl text-gray-700 shadow-lg">
              Nenhuma consulta agendada para hoje.
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {consultas.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#FFF4EA] p-6 rounded-3xl shadow-md"
                >
                  {/* Data */}
                  <p className="text-[#0d7d61] text-lg font-bold mb-4">
                    {c.data}
                  </p>

                  {/* Cabeçalho das colunas */}
                  <div className="flex justify-between font-semibold text-gray-600 text-sm mb-2">
                    <span>Motivo</span>
                    <span>Pet</span>
                    <span>Horário</span>
                  </div>

                  {/* Dados */}
                  <div className="flex justify-between text-gray-700">
                    <span>{c.motivo || "—"}</span>
                    <span>{c.petNome}</span>
                    <span>{c.horario}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}