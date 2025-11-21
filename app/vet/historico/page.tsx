"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getAllConsultas, getUserById, getPetById } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function VetHistorico() {
  const router = useRouter();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    getAllConsultas()
      .then(async all => {
        const mine = all.filter(
          (c: any) =>
            c.vetId === user.id &&
            (c.status === "finalizada" || c.status === "cancelada")
        );

        const resolved = await Promise.all(
          mine.map(async (c: any) => {
            const pet = await getPetById(c.petId);
            const tutor = await getUserById(c.tutorId);
            return {
              ...c,
              petNome: pet?.nome || `Pet ${c.petId}`,
              tutorNome: tutor?.nome || `Tutor ${c.tutorId}`,
            };
          })
        );

        setConsultas(resolved);
      })
      .finally(() => setLoading(false));
  }, []);

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
          HISTÓRICO - VETERINÁRIO
        </div>

        <div className="w-full max-w-6xl bg-[#FFF5EC] rounded-xl shadow-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FFF5EC] text-[#065F3A] font-bold">
                <th className="border border-gray-300 p-3 text-left">Data</th>
                <th className="border border-gray-300 p-3 text-left">Horário</th>
                <th className="border border-gray-300 p-3 text-left">Pet</th>
                <th className="border border-gray-300 p-3 text-left">Tutor</th>
                <th className="border border-gray-300 p-3 text-left">Status</th>
                <th className="border border-gray-300 p-3 text-left">Observações</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-[#065F3A] font-semibold"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : consultas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4 text-[#065F3A] font-semibold"
                  >
                    Sem histórico
                  </td>
                </tr>
              ) : (
                consultas.map((c) => (
                  <tr key={c.id} className="bg-[#FFF5EC] text-[#065F3A]">
                    <td className="border border-gray-300 p-3">{c.data}</td>
                    <td className="border border-gray-300 p-3">{c.hora}</td>
                    <td className="border border-gray-300 p-3">{c.petNome}</td>
                    <td className="border border-gray-300 p-3">{c.tutorNome}</td>
                    <td className="border border-gray-300 p-3 capitalize">
                      {c.status}
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