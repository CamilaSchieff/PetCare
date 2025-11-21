"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/componentes/header";
// Assumindo que você tem estas funções na API
import { createConsulta, getPets, getVets } from "@/app/lib/api"; 

export default function VetAgendar() {
    const router = useRouter();
    const [pets, setPets] = useState<any[]>([]);
    const [vets, setVets] = useState<any[]>([]); // Para escolher o vet (pode ser o próprio)
    const [formData, setFormData] = useState({
        petId: "",
        vetId: "",
        data: "",
        hora: "",
        observacoes: "", // Motivo ou observação inicial
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);

    const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
    const user = pc ? JSON.parse(pc) : null;

    useEffect(() => {
        if (!user || user.tipo !== "veterinario") { router.push("/login"); return; }
        
        // Define o próprio veterinário como o padrão
        setFormData(prev => ({ ...prev, vetId: user.id.toString() }));
        
        // Carrega Pets e Vets
        Promise.all([getPets(), getVets()])
            .then(([pList, vList]) => {
                setPets(pList);
                setVets(vList);
            })
            .catch(err => {
                setMsg("Erro ao carregar dados.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("Agendando consulta...");
        
        // Validação básica
        if (!formData.petId || !formData.data || !formData.hora || !formData.vetId) {
            setMsg("Preencha todos os campos obrigatórios (Pet, Veterinário, Data e Hora).");
            return;
        }

        try {
            const newConsulta = {
                petId: Number(formData.petId),
                vetId: Number(formData.vetId),
                data: formData.data,
                hora: formData.hora,
                observacoes: formData.observacoes,
                status: "pendente", // Nova consulta sempre começa como pendente
            };

            await createConsulta(newConsulta);
            setMsg("Consulta agendada com sucesso! Redirecionando...");
            setTimeout(() => router.push("/vet/agenda"), 1500);

        } catch (error) {
            setMsg("Erro ao agendar a consulta.");
            console.error(error);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-700">Carregando opções...</div>;
    
    return (
        <>
            <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
            <main className="max-w-4xl mx-auto pt-28 p-6">
                <h1 className="text-3xl font-extrabold text-[#065f46] mb-8">Agendar Nova Consulta</h1>
                
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border space-y-6">
                    
                    {/* Seleção do Pet */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Pet (Paciente) *</label>
                        <select 
                            name="petId" 
                            value={formData.petId} 
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065f46]"
                            required
                        >
                            <option value="">-- Selecione o Pet --</option>
                            {pets.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nome} (Tutor ID: {p.tutorId})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data e Hora */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Data *</label>
                            <input 
                                type="date" 
                                name="data" 
                                value={formData.data} 
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065f46]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Hora *</label>
                            <input 
                                type="time" 
                                name="hora" 
                                value={formData.hora} 
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065f46]"
                                required
                            />
                        </div>
                    </div>

                    {/* Veterinário Responsável */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Veterinário Responsável *</label>
                        <select 
                            name="vetId" 
                            value={formData.vetId} 
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#065f46]"
                            required
                        >
                            <option value="">-- Selecione o Veterinário --</option>
                            {vets.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.nome} (ID: {v.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Observações Iniciais */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Observações Iniciais / Motivo</label>
                        <textarea
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleChange}
                            placeholder="Descreva o motivo da consulta ou observações iniciais."
                            className="w-full p-3 border border-gray-300 rounded-lg min-h-24 focus:ring-2 focus:ring-[#065f46]/50"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full px-6 py-3 bg-[#065f46] text-white font-extrabold rounded-lg shadow-md hover:bg-[#044c38] transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Agendando..." : "Confirmar Agendamento"}
                    </button>

                    {msg && <div className={`mt-4 text-center p-3 rounded ${msg.includes("sucesso") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msg}</div>}
                </form>
            </main>
        </>
    );
}