"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasByTutor, getPetsByTutor } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function TutorHistorico() {
  const router = useRouter();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    Promise.all([getConsultasByTutor(user.id), getPetsByTutor(user.id)])
      .then(([c, p]) => {
        setConsultas(c.filter((x:any) => x.status === "finalizada" || x.status === "cancelada"));
        setPets(p);
      })
      .finally(()=>setLoading(false));
  }, []);

  function findPetName(id:number) {
    return pets.find(p=>p.id===id)?.nome || `Pet ${id}`;
  }

  return (
    <>
      <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
      <main className="max-w-4xl mx-auto pt-28 p-6">
        <h1 className="text-2xl font-bold mb-4">Histórico de Consultas</h1>
        {loading ? <div>Carregando...</div> :
          consultas.length === 0 ? <div>Sem histórico.</div> :
          <div className="space-y-4">
            {consultas.map(c=>(
              <div key={c.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{findPetName(c.petId)}</div>
                    <div className="text-sm text-gray-600">{c.data} — {c.hora}</div>
                  </div>
                  <div className="text-sm text-gray-600">{c.status}</div>
                </div>
                <div className="mt-2 text-gray-700">{c.observacoes || "Sem observações."}</div>
                <div className="mt-2 text-xs text-gray-500">Atendido por: Vet ID {c.vetId}</div>
              </div>
            ))}
          </div>
        }
      </main>
    </>
  );
}