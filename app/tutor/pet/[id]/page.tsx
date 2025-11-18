"use client";
import React, { useEffect, useState, useMemo } from "react";
// Simulação de next/navigation para ambiente de arquivo único
const useRouter = () => ({ push: (path: string) => console.log(`Navegando para: ${path}`) });
const useParams = () => ({ id: '1' }); // Mockando o ID 1 para carregar o primeiro pet (Rex)

// ====================================================================
// DEFINIÇÕES DOS ÍCONES SVG INLINE (Substituindo lucide-react)
// ====================================================================

const DogIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10 5l4 4-2 2-4-4 2-2zM5 10l4 4-2 2-4-4 2-2zM19 5l-4 4-2-2 4-4 2 2zM5 19l4-4 2 2-4 4-2-2zM15 15l-1 1-2-2 1-1 2 2z"/>
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const CalendarIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const ClipboardListIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <path d="M9 11h6"/><path d="M9 15h6"/><path d="M9 19h4"/>
    </svg>
);

const UserIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const EditIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>
);

const SaveIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
    </svg>
);

const XIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const TrashIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M15 2h3"/><path d="M6 2h3"/>
    </svg>
);

const HeartCrackIcon = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        <path d="m12 14-4-4 6-6"/>
        <path d="m16 2-4 4"/>
    </svg>
);

// ====================================================================
// MOCKS E FUNÇÕES ESSENCIAIS (Para que o arquivo seja runnable)
// ====================================================================

// MOCK: Componente Header
const Header = ({ user, onLogout }: any) => (
  <header className="fixed top-0 left-0 w-full bg-[#0b6b53] text-white shadow-lg z-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <div className="text-2xl font-bold tracking-tight">PetCare+</div>
      <button
        onClick={onLogout}
        className="flex items-center px-3 py-1 bg-[#085a48] rounded-full text-sm font-semibold hover:bg-[#06483a] transition"
      >
        <DogIcon size={16} className="mr-1" /> Sair
      </button>
    </div>
  </header>
);

// MOCK: Funções de API (Simulação de chamadas)
const mockDb = {
    1: { id: 1, nome: "Rex", especie: "Canino", raca: "Labrador", idade: 5, observacoes: "Leve alergia a grama.", tutorId: 101, status: "ativo", foto: 'https://placehold.co/160x160/D1E9FF/2563EB?text=R' },
    2: { id: 2, nome: "Mimi", especie: "Felino", raca: "Siamês", idade: 3, observacoes: "Castrada, sobrepeso leve.", tutorId: 101, status: "ativo", foto: 'https://placehold.co/160x160/FEE2E2/EF4444?text=M' },
    3: { id: 3, nome: "Fido", especie: "Canino", raca: "Poodle", idade: 15, observacoes: "Idoso, problemas cardíacos.", tutorId: 102, status: "falecido", foto: 'https://placehold.co/160x160/FFD9D9/A84B2E?text=F' },
};

const mockConsultasDb = [
    { id: 101, petId: 1, data: "2024-10-20", hora: "14:00", motivo: "Check-up", status: "FINALIZADO", observacoes: "Saúde ok, apenas desparasitação.", vetId: 201 },
    { id: 102, petId: 1, data: "2024-05-10", hora: "10:30", motivo: "Vacina V8", status: "FINALIZADO", observacoes: "Vacinação anual aplicada.", vetId: 202 },
    { id: 103, petId: 1, data: "2025-11-20", hora: "14:00", motivo: "Rotina", status: "PENDENTE", observacoes: "", vetId: 201 },
];

const getPetById = async (id: number): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDb[id as keyof typeof mockDb] || null;
};

const updatePet = async (id: number, updatedData: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Pet ${id} atualizado:`, updatedData);
    mockDb[id as keyof typeof mockDb] = updatedData;
};

const getConsultasByTutor = async (tutorId: number): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockConsultasDb;
};

// ====================================================================
// COMPONENTES AUXILIARES
// ====================================================================

// Componente auxiliar para exibir dados em linha
const DataRow = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color?: string }) => (
    <div className="flex items-start">
        <Icon size={20} className={`mt-1 mr-3 ${color || 'text-[#0b6b53]'}`} />
        <div>
            <span className="text-sm font-semibold text-gray-800">{label}:</span>
            <p className="text-md font-medium text-gray-700 break-words">{value}</p>
        </div>
    </div>
);

// Componente para card de Histórico
const ConsultaHistoryCard = ({ consulta, onClick }: { consulta: any, onClick: () => void }) => {
    const statusColor = consulta.status === 'FINALIZADO' ? 'bg-[#e5ffed] text-[#0b6b53]' : 'bg-[#ffe7d6] text-[#c1673d]';
    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-md cursor-pointer border border-gray-200 hover:shadow-lg transition flex flex-col gap-1"
        >
            <p className="text-[#a84b2e] font-bold text-lg flex items-center">
                <CalendarIcon size={18} className="mr-2"/>
                Consulta em {consulta.data} às {consulta.hora}
            </p>

            <div className="text-sm text-gray-700 flex flex-wrap gap-4 mt-1 ml-6">
                <span className="font-medium">Motivo: {consulta.motivo || "—"}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${statusColor}`}>
                    {consulta.status}
                </span>
            </div>

            {consulta.observacoes && (
                <p className="text-xs text-gray-600 ml-6 mt-2 italic">
                    <strong className="text-gray-800">Obs. Vet:</strong> {consulta.observacoes.substring(0, 100)}{consulta.observacoes.length > 100 ? '...' : ''}
                </p>
            )}
            <div className="mt-1 text-xs text-gray-400 ml-6">Atendido por: Vet ID {consulta.vetId}</div>
        </div>
    );
};


// ====================================================================
// PÁGINA PRINCIPAL
// ====================================================================

export default function PetDetails() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const petId = Number(id);

  const [pet, setPet] = useState<any>(null);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  
  // Estados para edição
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [obs, setObs] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'warning' } | null>(null);

  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  // MOCK: Se não tiver usuário logado, simula um tutor com ID 101 para carregar o pet mockado.
  const user = pc ? JSON.parse(pc) : { id: 101, nome: "Tutor Mock", tipo: "tutor" };

  const isTutor = user && user.tipo === "tutor";
  const isOwner = isTutor && pet && pet.tutorId === user.id;

  // Função de carregamento de dados
  useEffect(() => {
    if (!id || !user) { setLoading(false); return; }
    
    const loadData = async () => {
        try {
            const p = await getPetById(petId);

            if (!p) { setPet(null); setLoading(false); return; }

            // Verifica se o usuário tem permissão para ver este pet
            const hasPermission = (isTutor && p.tutorId === user.id) || user.tipo === "veterinario";
            if (!hasPermission) {
                setPet(null);
                setMessage({ text: "Acesso negado: Este pet não pertence à sua conta.", type: 'error' });
                setLoading(false);
                return;
            }

            setPet(p);
            setNome(p.nome || "");
            setRaca(p.raca || "");
            setIdade(p.idade || "");
            setObs(p.observacoes || "");

            // Carrega consultas
            const ownerId = isOwner ? user.id : p.tutorId; 
            const allConsultas = await getConsultasByTutor(ownerId);
            setConsultas(allConsultas.filter((c:any) => c.petId === p.id));
            
        } catch (err) {
            console.error(err);
            setMessage({ text: "Erro ao carregar dados.", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, [id]);

  async function handleSave() {
    if (!pet) return;
    setLoading(true);
    try {
        const updated = { ...pet, nome, raca, idade: Number(idade), observacoes: obs };
        await updatePet(pet.id, updated);
        setPet(updated);
        setEditing(false);
        setMessage({ text: "Dados do pet salvos com sucesso!", type: 'success' });
    } catch (error) {
        setMessage({ text: "Erro ao salvar os dados.", type: 'error' });
    } finally {
        setLoading(false);
    }
  }

  async function marcarFalecido() {
    if (!pet || !isOwner) return;
    
    // ATENÇÃO: Em uma aplicação real, você usaria um modal de confirmação, NUNCA alert()
    if (!window.confirm(`Tem certeza que deseja marcar ${pet.nome} como falecido? Esta ação é irreversível.`)) {
        return;
    }
    
    setLoading(true);
    try {
        const updated = { ...pet, status: "falecido" };
        await updatePet(pet.id, updated);
        setPet(updated);
        setMessage({ text: `${pet.nome} foi marcado como falecido.`, type: 'warning' });
    } catch (error) {
        setMessage({ text: "Erro ao atualizar status.", type: 'error' });
    } finally {
        setLoading(false);
    }
  }

  if (typeof localStorage !== "undefined" && !localStorage.getItem("pc_user") && id === '1') {
  } else if (!user) { 
      router.push("/login"); return null; 
  }


  if (loading) return <div className="p-6 text-center pt-32 text-[#0b6b53] text-xl">Carregando perfil do pet...</div>;
  
  if (!pet) {
    return (
        <div className="p-6 text-center pt-32">
            <h1 className="text-3xl font-bold text-red-600">
                {message ? message.text : "Pet não encontrado ou acesso não permitido."}
            </h1>
            <button onClick={() => router.push("/tutor/home")} className="mt-4 px-4 py-2 bg-[#0b6b53] text-white rounded-full">Voltar para Home</button>
        </div>
    );
  }

  // Estilo da imagem com borda de grama
  const PetImage = () => (
    <div className="w-40 h-40 rounded-full border-4 border-[#ffb89a] shadow-xl bg-gray-100 overflow-hidden flex-shrink-0">
        <img 
            src={pet.foto || `https://placehold.co/160x160/D1E9FF/2563EB?text=${pet.nome[0]}`} 
            alt={`Foto de ${pet.nome}`} 
            className="w-full h-full object-cover" 
            onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = `https://placehold.co/160x160/D1E9FF/2563EB?text=${pet.nome[0]}`;
            }}
        />
    </div>
  );

  return (
    <>
      <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }} />
      
      <main className="min-h-screen pb-20 pt-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
            
            {/* Mensagens de feedback */}
            {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {message.text}
                </div>
            )}

            {/* CARD PRINCIPAL DO PET */}
            <div className="bg-[#f7efe6] p-8 rounded-2xl shadow-xl border border-[#e7d7c9] mb-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-6">
                        <PetImage />
                        <div>
                            <h1 className="text-4xl font-extrabold text-[#0b6b53]">
                                {pet.nome} 
                                {pet.status === 'falecido' && <span className="text-red-600 text-2xl ml-3 flex items-center italic">
                                    <HeartCrackIcon size={20} className="mr-1"/> (Falecido)
                                </span>}
                            </h1>
                            <p className="text-lg text-gray-700 mt-1">{pet.especie} — {pet.raca}</p>
                        </div>
                    </div>
                    
                    {/* Botões de Ação */}
                    {isOwner && pet.status !== 'falecido' && (
                        <div>
                            {!editing ? (
                                <button onClick={()=>setEditing(true)} className="flex items-center gap-2 bg-[#ffb89a] text-[#a84b2e] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#e7a285] transition">
                                    <EditIcon size={18}/> Editar Dados
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex items-center gap-2 bg-[#0b6b53] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#085a48] transition">
                                        <SaveIcon size={18}/> Salvar
                                    </button>
                                    <button onClick={()=>setEditing(false)} className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-400 transition">
                                        <XIcon size={18}/> Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                    
                    {/* Modo de Visualização */}
                    {!editing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                            <DataRow icon={CalendarIcon} label="Idade" value={`${pet.idade || '?'} anos`}/>
                            <DataRow icon={DogIcon} label="Status" value={pet.status === 'falecido' ? 'Falecido' : 'Ativo'} color={pet.status === 'falecido' ? 'text-red-600' : 'text-green-600'}/>
                            <DataRow icon={ClipboardListIcon} label="Observações Médicas" value={pet.observacoes || "Sem observações."}/>
                            <DataRow icon={UserIcon} label="Tutor ID (Ref.)" value={pet.tutorId}/>
                        </div>
                    ) : (
                        
                        /* Modo de Edição */
                        <div className="space-y-4 max-w-lg mx-auto">
                            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#0b6b53] focus:border-[#0b6b53]" />
                            <input value={raca} onChange={e=>setRaca(e.target.value)} placeholder="Raça" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#0b6b53] focus:border-[#0b6b53]" />
                            <input 
                                type="number" 
                                value={String(idade)} 
                                onChange={e => {
                                    const val = e.target.value;
                                    setIdade(val === "" ? "" : Math.max(0, parseInt(val)));
                                }} 
                                placeholder="Idade (anos)" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#0b6b53] focus:border-[#0b6b53]" 
                            />
                            <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Observações médicas (visível apenas para o tutor/vet)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#0b6b53] focus:border-[#0b6b53] min-h-[100px]" />
                            
                            {/* Ação para marcar falecido, apenas no modo de edição para Owner */}
                            {isOwner && pet.status !== 'falecido' && (
                                <div className="pt-4 border-t border-gray-200 flex justify-end">
                                    <button onClick={marcarFalecido} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-700 transition">
                                        <TrashIcon size={18}/> Marcar como falecido
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* HISTÓRICO DE CONSULTAS DO PET */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-[#0b6b53] mb-6 border-b pb-3 flex items-center">
                    <ClipboardListIcon size={28} className="mr-3"/>
                    Histórico Clínico
                </h2>
                
                {consultas.length === 0 ? (
                    <div className="text-gray-600 p-4 bg-gray-50 rounded-lg text-center">
                        Este pet ainda não tem histórico de consultas registradas.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {consultas.map(c=>(
                            <ConsultaHistoryCard
                                key={c.id}
                                consulta={c}
                                onClick={() => router.push(`/tutor/consulta/${c.id}`)}
                            />
                        ))}
                    </div>
                )}
                
                {isOwner && (
                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={() => router.push("/tutor/nova-consulta")}
                            className="flex items-center gap-2 bg-[#0d7d61] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#0b6b53] transition"
                        >
                           <CalendarIcon size={20}/> Agendar Nova Consulta
                        </button>
                    </div>
                )}
            </div>
        </div>
      </main>
    </>
  );
}