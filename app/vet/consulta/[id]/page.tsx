"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/app/componentes/header";
import { getConsultaById, updateConsulta, getPetById, getVets, getUserById } from "@/app/lib/api";
import Link from "next/link";

interface ConsultaData {
    id: number;
    vetId: number;
    petId: number;
    tutorId: number; // Adicionar tutorId para buscar o nome do tutor
    status: "pendente" | "em_andamento" | "finalizada" | "cancelada";
    observacoes: string;
    data: string;
    hora: string;
}

interface PetData {
    id: number;
    nome: string;
    especie: string;
    raca: string; // Adicionar raça
    imagemUrl?: string; // Adicionar imagem
}

export default function VetConsultaDetalhes() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const consultaId = Number(id);

    const [consulta, setConsulta] = useState<ConsultaData | null>(null);
    const [pet, setPet] = useState<PetData | null>(null);
    const [tutorNome, setTutorNome] = useState<string | null>(null); // Novo estado para o nome do tutor
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
            
            // 1. Carrega o Pet
            const p = await getPetById(c.petId);
            setPet(p);

            // 2. Carrega o Tutor
            const t = await getUserById(p.tutorId); // Assume que getPetById retorna tutorId
            setTutorNome(t?.nome || `Tutor ${p?.tutorId}`);

            // 3. Configura a Consulta
            setConsulta(c);
            setObservacoes(c.observacoes || "");
            
            // 4. Configura lista de Vets (exceto o logado)
            setVets(vList.filter((v:any) => v.id !== user.id));
            setLoading(false);
        }).catch(err => {
            setMsg("Erro ao carregar dados.");
            setLoading(false);
            console.error(err);
        });
    }, [consultaId]);

    const isEditable = consulta?.status === 'pendente' || consulta?.status === 'em_andamento';
    const isPendente = consulta?.status === 'pendente';

    async function handleUpdateStatus(status: ConsultaData['status'], newVetId?: number) {
        if (!consulta || (!isEditable && !newVetId)) return;

        // Regra: Não permite finalizar se as observações estiverem vazias
        if (status === 'finalizada' && !observacoes.trim()) {
            setMsg("As Observações (Laudo) são obrigatórias para finalizar a consulta.");
            return;
        }

        setMsg("Atualizando...");
        try {
            const payload: any = { status, observacoes };
            
            if (newVetId) {
                payload.vetId = newVetId;
                // Ao encaminhar, o status sempre volta a ser 'pendente'
                payload.status = "pendente"; 
            } else if (status === "pendente" && isPendente) {
                // Se o status for "pendente" e já estiver pendente, apenas salva as observações
                payload.status = "pendente"; 
            } else if (status === "em_andamento") {
                // Atualiza para 'em_andamento'
                payload.status = "em_andamento";
            }
            // Não precisa de `else if (status === "finalizada" || status === "cancelada")` pois já está no payload

            await updateConsulta(consulta.id, payload);
            setMsg(`Consulta ${newVetId ? 'encaminhada' : status} com sucesso!`);
            
            setConsulta((prev: ConsultaData | null) => {
                if (!prev) return null;
                return ({ 
                    ...prev, 
                    status: payload.status, 
                    observacoes, 
                    vetId: newVetId || prev.vetId 
                })
            });
            
            // Redireciona para a agenda após finalizar, cancelar ou encaminhar
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
        await handleUpdateStatus("pendente", Number(encaminharVetId));
    }
    
    // Novo: Botão para Iniciar Consulta (Passa de pendente para em_andamento)
    async function handleIniciarConsulta() {
        await handleUpdateStatus("em_andamento");
    }


    if (loading) return <div className="p-6 text-center text-gray-700">Carregando detalhes da consulta...</div>;
    if (!consulta) return <div className="p-6 text-center text-red-600">{msg || "Consulta não encontrada."}</div>;

    return (
        <>
            <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
            <main className="max-w-4xl mx-auto pt-28 p-6">
                <h1 className="text-3xl font-extrabold text-[#065f46] mb-6">Consulta #{consulta.id}</h1>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Detalhes do Paciente</h2>
                    
                    {/* Exibe Pet e Tutor */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <p>
                            <strong>Pet:</strong> 
                            {pet ? <Link href={`/tutor/pet/${pet.id}`} className="text-blue-600 underline ml-1 font-medium">{pet.nome}</Link> : `ID ${consulta.petId}`}
                        </p>
                        <p><strong>Tutor:</strong> {tutorNome || 'Carregando...'}</p>
                        <p><strong>Espécie:</strong> {pet?.especie || 'N/A'}</p>
                        <p><strong>Raça:</strong> {pet?.raca || 'N/A'}</p>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-lg"><strong>Data/Hora:</strong> {consulta.data} às {consulta.hora}</p>
                        <p className="mt-2">
                            <strong>Status:</strong> 
                            <span className={`px-2 py-0.5 rounded-full uppercase font-bold ml-2 text-sm 
                                ${consulta.status === 'finalizada' ? 'bg-green-100 text-green-800' : 
                                  consulta.status === 'cancelada' ? 'bg-red-100 text-red-800' : 
                                  consulta.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {consulta.status.replace('_', ' ')}
                            </span>
                        </p>
                    </div>

                    {/* AÇÕES E OBSERVAÇÕES (APENAS PARA PENDENTE/EM_ANDAMENTO) */}
                    {isEditable && (
                        <>
                            <h3 className="text-lg font-bold pt-4 border-t">Observações e Laudo</h3>
                            <textarea
                                value={observacoes}
                                onChange={e => setObservacoes(e.target.value)}
                                placeholder="Registre aqui o Laudo, observações do atendimento, diagnóstico, tratamento, etc. (Obrigatório para finalizar)"
                                className="w-full p-3 border border-gray-300 rounded-lg min-h-32 focus:ring-2 focus:ring-[#065f46]/50"
                            />

                            <div className="flex gap-4 flex-wrap pt-2 items-center">
                                
                                {/* Botão INICIAR Consulta */}
                                {isPendente && (
                                    <button 
                                        onClick={handleIniciarConsulta} 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Iniciar Atendimento
                                    </button>
                                )}
                                
                                {/* Botão FINALIZAR Consulta */}
                                <button 
                                    onClick={() => handleUpdateStatus("finalizada")} 
                                    disabled={!observacoes.trim()}
                                    className="px-4 py-2 bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-green-800 transition"
                                >
                                    Finalizar Consulta
                                </button>
                                
                                {/* Botão CANCELAR Consulta */}
                                <button 
                                    onClick={() => handleUpdateStatus("cancelada")} 
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                                >
                                    Cancelar Consulta
                                </button>

                                {/* Formulário de Encaminhamento */}
                                <form onSubmit={handleEncaminhar} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 ml-auto">
                                    <label className="font-medium text-gray-700">Encaminhar para:</label>
                                    <select value={encaminharVetId} onChange={e => setEncaminharVetId(e.target.value)} className="p-2 border rounded-lg focus:ring-1 focus:ring-orange-500">
                                        <option value="">-- selecione outro vet --</option>
                                        {vets.map((v:any) => <option key={v.id} value={v.id}>{v.nome}</option>)}
                                    </select>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-orange-600 transition" 
                                        disabled={!encaminharVetId}
                                    >
                                        Encaminhar
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                    
                    {/* VISUALIZAÇÃO DE OBSERVÇÕES (PARA FINALIZADA/CANCELADA) */}
                    {!isEditable && (
                        <div className="pt-4 border-t">
                            <h3 className="text-lg font-bold">Observações / Laudo:</h3>
                            <p className="mt-2 p-4 bg-gray-100 rounded-lg border whitespace-pre-wrap text-gray-800">
                                {consulta.observacoes || "Sem observações registradas."}
                            </p>
                        </div>
                    )}

                    {msg && <div className="mt-4 text-base text-center text-red-600 font-medium">{msg}</div>}
                </div>
            </main>
        </>
    );
}