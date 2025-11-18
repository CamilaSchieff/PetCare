"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/componentes/header";
import { getConsultaById, updateConsulta, getPetById, getVets } from "@/app/lib/api";
import Link from "next/link";

interface ConsultaData {
  id: number;
  vetId: number;
  petId: number;
  status: "pendente" | "em_andamento" | "finalizada" | "cancelada";
  observacoes: string;
  data: string;
  hora: string;
}

interface PetData {
  id: number;
  nome: string;
  especie: string;
}

export default function VetConsultaDetalhes() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const consultaId = Number(id);

  const [consulta, setConsulta] = useState<ConsultaData | null>(null);
  const [pet, setPet] = useState<PetData | null>(null);
  const [vets, setVets] = useState<any[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [encaminharVetId, setEncaminharVetId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    if (!user || user.tipo !== "veterinario" || !consultaId) {
      router.push("/login");
      return;
    }
    Promise.all([
      getConsultaById(consultaId),
      getVets()
    ]).then(async ([c, vList]) => {
      if (!c) { setMsg("Consulta não encontrada."); setLoading(false); return; }
      setConsulta(c);
      setObservacoes(c.observacoes || "");
        
      const p = await getPetById(c.petId);
      setPet(p);
      
      setVets(vList.filter((v:any) => v.id !== user.id));
      setLoading(false);
    }).catch(err => {
      setMsg("Erro ao carregar dados.");
      setLoading(false);
      console.error(err);
    });
  }, [consultaId]);

  const isEditable = consulta?.status === 'pendente' || consulta?.status === 'em_andamento';

  async function handleUpdateStatus(status: ConsultaData['status'], newVetId?: number) {
    if (!consulta || (!isEditable && !newVetId)) return;

    setMsg("Atualizando...");
    try {
      const payload: any = { status, observacoes };
      
      if (newVetId) {
        payload.vetId = newVetId; // Novo veterinário (para encaminhamento)
        payload.status = "pendente"; // Volta a ser pendente para o novo vet
      }

      await updateConsulta(consulta.id, payload);
      setMsg(`Consulta ${newVetId ? 'encaminhada' : status} com sucesso!`);
      
      // 4. Tipagem do 'prev' e uso do status do payload
      setConsulta((prev: ConsultaData | null) => {
        if (!prev) return null;
        return ({ ...prev, status: payload.status, observacoes, vetId: newVetId || prev.vetId })
      });
      
      if (status === "finalizada" || status === "cancelada" || newVetId) {
        setTimeout(() => router.push("/vet/agenda"), 1000);
      }
      
    } catch (err) {
      setMsg("Erro ao atualizar consulta.");
      console.error(err);
    }
  }

  async function handleEncaminhar(e: React.FormEvent) {
    e.preventDefault();
    if (!encaminharVetId) { setMsg("Selecione um veterinário para encaminhar."); return; }
    // A chamada agora está tipada corretamente
    await handleUpdateStatus("pendente", Number(encaminharVetId));
  }

  if (loading) return <div className="p-6">Carregando detalhes da consulta...</div>;
  if (!consulta) return <div className="p-6">{msg || "Consulta não encontrada."}</div>;

  return (
    <>
      <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
      <main className="max-w-4xl mx-auto pt-28 p-6">
        <h1 className="text-3xl font-extrabold text-[#0b6b53] mb-6">Consulta {consulta.id}</h1>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold">Detalhes</h2>
          
          <p><strong>Pet:</strong> 
            {pet ? <Link href={`/tutor/pet/${pet.id}`} className="text-blue-600 underline ml-1">{pet.nome} ({pet.especie})</Link> : `ID ${consulta.petId}`}
          </p>
          <p><strong>Data/Hora:</strong> {consulta.data} às {consulta.hora}</p>
          <p>
            <strong>Status:</strong> 
            <span className={`px-2 py-0.5 rounded-full uppercase font-medium ml-1 
              ${consulta.status === 'finalizada' ? 'bg-green-100 text-green-800' : 
                consulta.status === 'cancelada' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}
            >
              {consulta.status.replace('_', ' ')}
            </span>
          </p>

          {isEditable && (
            <>
              <h3 className="text-lg font-bold pt-4">Observações e Ações</h3>
              <textarea
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Observações do atendimento, diagnóstico, tratamento, etc."
                className="w-full p-2 border rounded min-h-32"
              />

              <div className="flex gap-4 flex-wrap">
                <button 
                  onClick={() => handleUpdateStatus("finalizada")} 
                  disabled={!observacoes}
                  className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50 hover:bg-green-800 transition"
                >
                  Finalizar Consulta
                </button>
                
                <button 
                  onClick={() => handleUpdateStatus("cancelada")} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Cancelar Consulta
                </button>

                <form onSubmit={handleEncaminhar} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border">
                  <label className="font-medium text-gray-700">Encaminhar para:</label>
                  <select value={encaminharVetId} onChange={e => setEncaminharVetId(e.target.value)} className="p-2 border rounded">
                    <option value="">-- selecione outro vet --</option>
                    {vets.map((v:any) => <option key={v.id} value={v.id}>{v.nome}</option>)}
                  </select>
                  <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50 hover:bg-orange-600 transition" disabled={!encaminharVetId}>
                    Encaminhar
                  </button>
                </form>
              </div>
            </>
          )}
          
          {!isEditable && (
            <div className="pt-4">
              <h3 className="text-lg font-bold">Observações Registradas:</h3>
              <p className="mt-2 p-3 bg-gray-100 rounded border whitespace-pre-wrap">{consulta.observacoes || "Sem observações."}</p>
            </div>
          )}

          {msg && <div className="mt-4 text-sm text-center text-red-600 font-medium">{msg}</div>}
        </div>
      </main>
    </>
  );
}
