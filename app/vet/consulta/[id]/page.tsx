"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasByVet, getPetById, updateConsulta } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function VetAgenda() {
  const router = useRouter();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConsulta, setEditingConsulta] = useState<any>(null);

  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    if (!user || user.tipo !== "veterinario") {
      router.push("/login");
      return;
    }
    loadConsultas();
  }, []);

  async function loadConsultas() {
    setLoading(true);
   try {
     const allConsultas = await getConsultasByVet(user.id);
     const futuras = allConsultas.filter(
        (c: any) => c.status === "pendente" || c.status === "em_andamento"
      );

      const consultasComDetalhes = await Promise.all(
        futuras.map(async (c: any) => {
          const pet = await getPetById(c.petId);
          const petNome = pet?.nome || `Pet ${c.petId}`;
          const tutor = await fetch(`/api/users/${c.tutorId}`)
            .then((res) => res.json())
            .catch(() => null);
          const tutorNome = tutor?.nome || `Tutor ${c.tutorId}`;

          return {
           ...c,
            petNome,
            tutorNome,
            pet,
         };
        })
     );

      consultasComDetalhes.sort((a, b) => {
        const dateTimeA = `${a.data} ${a.hora}`;
       const dateTimeB = `${b.data} ${b.hora}`;
       return dateTimeA.localeCompare(dateTimeB);
     });

      setConsultas(consultasComDetalhes);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setLoading(false);
    }
  }


  async function concluirConsulta(consulta: any) {
    await updateConsulta(consulta.id, { status: "concluida" });
    loadConsultas();
  }

  async function salvarLaudo(consulta: any, laudo: string) {
    await updateConsulta(consulta.id, { laudo, status: "concluida" });
    setEditingConsulta(null);
    loadConsultas();
  }

  async function remarcarConsulta(consulta: any, novaData: string, novaHora: string) {
    await updateConsulta(consulta.id, { data: novaData, hora: novaHora });
    setEditingConsulta(null);
    loadConsultas();
  }

  const ConsultaCard = ({ consulta }: { consulta: any }) => {
    const [laudo, setLaudo] = useState(consulta.laudo || "");
    const [novaData, setNovaData] = useState(consulta.data);
    const [novaHora, setNovaHora] = useState(consulta.hora);

    return (
      <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
        <div className="text-lg font-bold text-[#0b6b53]">{consulta.petNome}</div>
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">Data/Hora:</span> {consulta.data} às {consulta.hora}
        </div>
        <div className="text-xs mt-2">
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-0.5 rounded-full uppercase font-medium ${
              consulta.status === "pendente"
                ? "bg-yellow-100 text-yellow-800"
                : consulta.status === "em_andamento"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {consulta.status.replace("_", " ")}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {consulta.status !== "concluida" && (
            <button
              onClick={() => concluirConsulta(consulta)}
              className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
            >
              Concluir
            </button>
          )}

          <div>
            <input
              type="text"
              value={laudo}
              onChange={(e) => setLaudo(e.target.value)}
              placeholder="Digite o laudo"
              className="border p-1 rounded w-full mt-1"
            />
            <button
              onClick={() => salvarLaudo(consulta, laudo)}
              className="bg-blue-600 text-white py-1 px-3 rounded mt-1 hover:bg-blue-700"
            >
              Salvar Laudo
            </button>
          </div>

          <div className="flex gap-2 mt-1">
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="border p-1 rounded"
            />
            <input
              type="time"
              value={novaHora}
              onChange={(e) => setNovaHora(e.target.value)}
              className="border p-1 rounded"
            />
            <button
              onClick={() => remarcarConsulta(consulta, novaData, novaHora)}
              className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
            >
              Remarcar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header user={user} />
      <main className="max-w-4xl mx-auto pt-28 p-6">
        <h1 className="text-3xl font-extrabold text-[#0b6b53] mb-6">Minha Agenda</h1>

        {loading ? (
          <div>Carregando consultas...</div>
        ) : consultas.length === 0 ? (
          <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">Sem consultas agendadas.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {consultas.map((c) => (
              <ConsultaCard key={c.id} consulta={c} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}