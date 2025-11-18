"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import PetCard from "@/app/componentes/petcard";
import { getPetsByTutor, getConsultasByTutor } from "@/app/lib/api";
import { useRouter } from "next/navigation";


const ConsultaCard = ({ consulta, onClick }: { consulta: any, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-[#f7efe6] p-5 rounded-xl shadow-md cursor-pointer border border-[#e7d7c9] hover:shadow-lg transition flex flex-col gap-1"
  >
    <p className="text-[#0b6b53] font-bold text-lg">
      {new Date(consulta.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })}
    </p>

    <div className="text-sm text-gray-700 flex flex-wrap gap-4">
      <span><strong>Motivo:</strong> {consulta.motivo || "—"}</span>
      <span><strong>Veterinário:</strong> {consulta.vetId}</span>
      <span><strong>Horário:</strong> {consulta.hora || "--:--"}</span>
    </div>

    <div className="mt-2">
      <span
        className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
          consulta.status === "CONFIRMADO"
            ? "bg-[#ffb89a] text-[#a84b2e]"
            : "bg-[#ffe7d6] text-[#c1673d]"
        }`}
      >
        {consulta.status || "PENDENTE"}
      </span>
    </div>
  </div>
);

export default function TutorHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
    if (!s) {
      setLoading(false);
      router.push("/login");
      return;
    }
    const u = JSON.parse(s);
    setUser(u);

    Promise.all([getPetsByTutor(u.id), getConsultasByTutor(u.id)])
      .then(([p, c]) => {
        setPets(p);
        setConsultas(c);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !user) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <>
      <Header
        user={user}
        onLogout={() => {
          localStorage.removeItem("pc_user");
          router.push("/login");
        }}
      />

      <main className="pt-32 bg-[#0d7d61] min-h-screen pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-white mb-10">
            Olá, {user.nome}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* MEUS PETS */}
            <div className="bg-[#f7efe6] shadow-xl p-8 rounded-2xl border border-[#e7d7c9]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#0b6b53]">Meus Pets</h3>

                <button
                  onClick={() => router.push("/tutor/adicionar-pet")}
                  className="flex items-center gap-2 bg-white border border-[#0b6b53] text-[#0b6b53] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#f2fff9] transition"
                >
                 Adicionar Pet
                </button>
              </div>

              <div className="grid gap-4">
                {pets.length === 0 ? (
                  <div className="text-gray-600 p-4 bg-gray-50 rounded-lg">
                    Nenhum pet cadastrado.
                  </div>
                ) : (
                  pets.map((p) => (
                    <PetCard
                      key={p.id}
                      pet={p}
                      onClick={() => router.push(`/tutor/pet/${p.id}`)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* CONSULTAS */}
            <div className="bg-[#f7efe6] shadow-xl p-8 rounded-2xl border border-[#e7d7c9]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#0b6b53]">Próximas Consultas</h3>

                <button
                  onClick={() => router.push("/tutor/nova-consulta")}
                  className="flex items-center gap-2 bg-white border border-[#0b6b53] text-[#0b6b53] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#f2fff9] transition"
                >
                  Agendar Consulta
                </button>
              </div>

              <div className="grid gap-4">
                {consultas.length === 0 ? (
                  <div className="text-gray-600 p-4 bg-gray-50 rounded-lg">
                    Sem consultas futuras.
                  </div>
                ) : (
                  consultas.map((c) => (
                    <ConsultaCard
                      key={c.id}
                      consulta={c}
                      onClick={() => router.push(`/tutor/consulta/${c.id}`)}
                    />
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}