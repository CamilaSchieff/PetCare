"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getPetsByTutor, getVets, isVetAvailable, createConsulta } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function NovaConsulta() {
  const router = useRouter();
  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  const [pets, setPets] = useState<any[]>([]);
  const [vets, setVets] = useState<any[]>([]);
  const [petId, setPetId] = useState<string>("");
  const [vetId, setVetId] = useState<string>("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    getPetsByTutor(user.id).then(setPets).catch(()=>{});
    getVets().then(setVets).catch(()=>{});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!petId || !vetId || !data || !hora) {
      setMsg("Preencha todos os campos");
      return;
    }

    const available = await isVetAvailable(Number(vetId), data, hora);
    if (!available) {
      setMsg("Veterinário indisponível nesse dia/horário.");
      return;
    }

    try {
      await createConsulta({
        petId: Number(petId),
        tutorId: user.id,
        vetId: Number(vetId),
        data,
        hora,
        status: "pendente",
        observacoes: obs
      });

      setMsg("Consulta agendada com sucesso!");
      setTimeout(() => router.push("/tutor/home"), 700);
    } catch (err) {
      console.error(err);
      setMsg("Erro ao agendar consulta");
    }
  }

  async function findAvailableVets() {
    if (!data || !hora) {
      setMsg("Escolha data e hora antes de checar disponibilidade.");
      return;
    }

    const list = await Promise.all(
      vets.map(async (v: any) => {
        const ok = await isVetAvailable(v.id, data, hora);
        return { ...v, available: ok };
      })
    );

    setVets(list);
  }

  return (
    <>
      <Header user={user} onLogout={() => { localStorage.removeItem("pc_user"); router.push("/login"); }}
      />

      <main className="pt-32 min-h-screen bg-[#106944] flex flex-col items-center">

        <button className="bg-[#fa8f6b] text-white font-semibold px-10 py-3 rounded-full text-lg shadow-md mb-10">
          AGENDAR CONSULTA
        </button>

        <div className="bg-[#ffefe3] p-10 rounded-3xl shadow-xl w-[90%] max-w-2xl border border-[#ead7c5]">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="text-[#0b6b53] font-bold text-sm">Pet</label>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700 bg-white"
              >
                <option value="">Selecione um pet</option>
                {pets.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.especie})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#0b6b53] font-bold text-sm">Veterinário</label>

              <div className="relative">
                <select
                  value={vetId}
                  onChange={(e) => setVetId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700 bg-white"
                >
                  <option value="">Selecione o veterinário</option>
                  {vets.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.nome} {v.available === false ? "(Ocupado)" : v.available === true ? "(Livre)" : ""}
                    </option>
                  ))}
                </select>

              </div>

              <button
                type="button"
                onClick={findAvailableVets}
                className="mt-2 text-sm text-[#0b6b53] underline font-semibold"
              >
                Checar disponibilidade
              </button>
            </div>

            <div>
              <label className="text-[#0b6b53] font-bold text-sm">Tipo de atendimento</label>
              <select
                className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700 bg-white"
              >
                <option value="">Selecione o tipo</option>
                <option value="consulta">Consulta</option>
                <option value="emergencia">Emergência</option>
                <option value="retorno">Retorno</option>
              </select>
            </div>

            <div>
              <label className="text-[#0b6b53] font-bold text-sm">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700"
              />
            </div>

            <div>
              <label className="text-[#0b6b53] font-bold text-sm">Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700"
              />
            </div>

            <textarea
              placeholder="Observações (opcional)"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 text-gray-700 bg-white"
            />

            {msg && (
              <p className="text-center text-sm text-[#d05c48] font-semibold">{msg}</p>
            )}
            
            <button
              type="submit"
              className="w-full bg-[#fa8f6b] text-white font-bold py-3 rounded-full shadow-md"
            >
              Solicitar Consulta
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
