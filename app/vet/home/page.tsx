"use client";

import { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasDoDia } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function VetHome() {
  const router = useRouter();
  const [vet, setVet] = useState<any>(null);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("pc_user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setVet(parsed);

      getConsultasDoDia(parsed.id)
        .then(data => {
          data.sort((a: { horario: string; }, b: { horario: any; }) => a.horario.localeCompare(b.horario));
          setConsultas(data);
        })
        .catch((err: any) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center mt-10 text-white">Carregando...</p>;
  if (!vet) return <p className="text-center mt-10 text-white">Nenhum veterinário logado.</p>;

  return (
    <>
      <Header
        user={vet}
        onLogout={() => {
          localStorage.removeItem("pc_user");
          router.push("/login");
        }}
      />

      <main className="min-h-screen w-full bg-[#106944] pt-32 px-6 relative overflow-hidden">
        <div className="absolute top-10 left-0 w-96 h-96 bg-[#0b7a5c] opacity-30 rounded-full blur-3xl" />
        <div className="absolute top-32 right-0 w-96 h-96 bg-[#0b7a5c] opacity-30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">

          <h1 className="text-white text-2xl md:text-3xl font-extrabold mb-8">
            CONSULTAS DO DIA
          </h1>

          {consultas.length === 0 ? (
            <div className="bg-[#FFF4EA] text-center p-6 rounded-3xl text-gray-700 shadow-lg">
              Nenhuma consulta agendada para hoje.
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {consultas.map((c: any) => (
                <div key={c.id} className="bg-[#FFF4EA] p-6 rounded-3xl shadow-lg">

                  <p className="text-[#0d7d61] text-lg font-bold mb-4">
                    {c.data}
                  </p>

                  <div className="grid grid-cols-4 font-semibold text-gray-600 text-sm mb-1">
                    <span>Pet</span>
                    <span>Tutor</span>
                    <span>Horário</span>
                    <span>Status</span>
                  </div>

                  <div className="grid grid-cols-4 text-gray-700">
                    <span>{c.petNome}</span>
                    <span>{c.tutorNome}</span>
                    <span>{c.horario}</span>
                    <span className="capitalize">{c.status}</span>
                  </div>

                  <button
                    onClick={() => router.push(`/vet/registrar/${c.id}`)}
                    className="mt-4 bg-[#0d7d61] text-white px-4 py-2 rounded-xl shadow-md hover:brightness-90 transition"
                  >
                    Registrar
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}