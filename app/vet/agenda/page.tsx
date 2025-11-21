"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasByVet, getPetById } from "@/app/lib/api";
import { useRouter } from "next/navigation";

interface Consulta {
    id: number;
    petId: number;
    data: string;
    hora: string;
    status: "pendente" | "em_andamento" | "finalizada" | "cancelada";
    petNome?: string;
    petEspecie?: string;     
    petImagem?: string;       
}

export default function VetAgenda() {
    const router = useRouter();
    const [consultas, setConsultas] = useState<Consulta[]>([]);
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

            const consultasComPetNome = await Promise.all(futuras.map(async (c: any) => {
                const pet = await getPetById(c.petId);
                return { ...c, petNome: pet?.nome || `Pet ${c.petId}`, petEspecie: pet?.especie, petImagem: pet?.imagemUrl }; 
            }));

            consultasComPetNome.sort((a, b) => {
                const dateTimeA = `${a.data} ${a.hora}`;
                const dateTimeB = `${b.data} ${b.hora}`;
                return dateTimeA.localeCompare(dateTimeB);
            });

            setConsultas(consultasComPetNome as Consulta[]);
        } catch (error) {
            console.error("Erro ao carregar consultas:", error);
        } finally {
            setLoading(false);
        }
    }

    const ConsultaCard = ({ consulta }: { consulta: Consulta }) => (
        <div
            onClick={() => router.push(`/vet/consulta/${consulta.id}`)}
            className="border border-gray-200 p-4 rounded-xl shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    {/*  */}
                    {consulta.petImagem ? (
                        <img src={consulta.petImagem} alt={`Foto de ${consulta.petNome}`} className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-full h-full text-gray-500 p-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    )}
                </div>

                <div className="flex-grow">
                    <div className="text-xl font-bold text-[#065f46]">{consulta.petNome}</div>
                    <div className="text-sm text-gray-700 mt-1">
                        <span className="font-semibold">Espécie:</span> {consulta.petEspecie || 'Desconhecida'}
                    </div>
                </div>
            </div>
            
            <div className="mt-3 border-t pt-3 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    <span className="font-semibold">Horário:</span> {consulta.data} às {consulta.hora}
                </div>
                <span className={`px-3 py-1 text-xs rounded-full uppercase font-bold 
                    ${consulta.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      consulta.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' : ''
                    }`}
                >
                    {consulta.status.replace('_', ' ')}
                </span>
            </div>
        </div>
    );

    return (
        <>
            <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
            <main className="max-w-4xl mx-auto pt-28 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-[#065f46]">Minha Agenda</h1>
                    <button 
                        onClick={() => router.push("/vet/agendar")}
                        className="px-4 py-2 bg-[#065f46] text-white font-semibold rounded-lg shadow-md hover:bg-[#044c38] transition-colors"
                    >
                        + Agendar Nova
                    </button>
                </div>

                {loading ? (
                    <div className="text-center p-6 text-gray-600">Carregando consultas...</div>
                ) : (
                    consultas.length === 0 ? (
                        <div className="text-gray-500 p-6 bg-gray-50 rounded-xl text-center shadow-inner">
                            Sem consultas pendentes ou em andamento.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {consultas.map(c => <ConsultaCard key={c.id} consulta={c} />)}
                        </div>
                    )
                )}
            </main>
        </>
    );
}