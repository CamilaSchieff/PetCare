"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getConsultasByTutor, getPetsByTutor } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function TutorHistorico() {
  const router = useRouter();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pc =
    typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    Promise.all([getConsultasByTutor(user.id), getPetsByTutor(user.id)])
      .then(([c, p]) => {
        setConsultas(
          c.filter(
            (x: any) => x.status === "finalizada" || x.status === "cancelada"
          )
        );
        setPets(p);
      })
      .finally(() => setLoading(false));
  }, []);

  function findPetName(id: number) {
    return pets.find((p) => p.id === id)?.nome || `Pet ${id}`;
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

      <main
        className={`${poppins.className} min-h-screen bg-[#106944] pt-28 px-6 flex flex-col items-center`}
      >

        <div className="bg-[#FF8F63] text-white font-semibold text-lg px-6 py-2 rounded-full shadow-md mb-8">
          HISTÓRICO
        </div>

        <div className="w-full max-w-5xl bg-[#FFF5EC] rounded-xl shadow-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FFF5EC] text-[#065F3A] font-bold">
                <th className="border border-gray-300 p-3 text-left">Data</th>
                <th className="border border-gray-300 p-3 text-left">Horário</th>
                <th className="border border-gray-300 p-3 text-left">Pet</th>
                <th className="border border-gray-300 p-3 text-left">
                  Observações
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4 text-[#065F3A] font-semibold"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : consultas.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4 text-[#065F3A] font-semibold"
                  >
                    Sem histórico
                  </td>
                </tr>
              ) : (
                consultas.map((c) => (
                  <tr key={c.id} className="bg-[#FFF5EC]">
                    <td className="border border-gray-300 p-3">{c.data}</td>

                    <td className="border border-gray-300 p-3">{c.hora}</td>

                    <td className="border border-gray-300 p-3">
                      {findPetName(c.petId)}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {c.observacoes || "Sem observações."}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}