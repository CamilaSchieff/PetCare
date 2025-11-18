// src/app/vet/agenda/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasByVet, getPetById } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function VetAgenda() {
    const router = useRouter();
    const [consultas, setConsultas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
    const user = pc ? JSON.parse(pc) : null;

    useEffect(() => {

        if (!user || user.tipo !== "veterinario") { router.push("/login"); return; }
        loadConsultas();
    }, []);

    async function loadConsultas() {
        setLoading(true);
        try {
            const allConsultas = await getConsultasByVet(user.id);
            const futuras = allConsultas.filter((c: any) => c.status === "pendente" || c.status === "em_andamento");

// Resolve Pet Names
            const consultasComPetNome = await Promise.all(futuras.map(async (c: any) => {
                const pet = await getPetById(c.petId);
                return { ...c, petNome: pet?.nome || `Pet ${c.petId}` };
            }));

// Ordenar por data e hora
            consultasComPetNome.sort((a, b) => {
                const dateTimeA = `${a.data} ${a.hora}`;
                const dateTimeB = `${b.data} ${b.hora}`;
                return dateTimeA.localeCompare(dateTimeB);
            });

        setConsultas(consultasComPetNome);
        } catch (error) {
            console.error("Erro ao carregar consultas:", error);
        } finally {
            setLoading(false);
        }
    }

    const ConsultaCard = ({ consulta }: { consulta: any }) => (
        <div 
            onClick={() => router.push(`/vet/consulta/${consulta.id}`)}
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:shadow-md transition"
        >
            <div className="text-lg font-bold text-[#0b6b53]">{consulta.petNome}</div>
            <div className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Data/Hora:</span> {consulta.data} às {consulta.hora}
            </div>
            <div className="text-xs mt-2">
                <strong>Status:</strong>{" "}
            <span className={`px-2 py-0.5 rounded-full uppercase font-medium ${consulta.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                {consulta.status.replace('_', ' ')}
            </span>
            </div>
        </div>
    );

    return (
        <>
            <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
            <main className="max-w-4xl mx-auto pt-28 p-6">
                <h1 className="text-3xl font-extrabold text-[#0b6b53] mb-6">Minha Agenda</h1>

                {loading ? <div>Carregando consultas...</div> :
                    consultas.length === 0 ? <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">Sem consultas agendadas.</div> :
                <div className="grid gap-4 md:grid-cols-2">
                    {consultas.map(c => <ConsultaCard key={c.id} consulta={c} />)}
                </div>
                }
            </main>
        </>
    );
}