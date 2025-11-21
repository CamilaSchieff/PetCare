"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import { getUserById, updateUser } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function PerfilVet() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [edit, setEdit] = useState(false);

  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    if (!user) return;
    load();
  }, []);

  async function load() {
    const data = await getUserById(user.id);
    setUserData(data);
  }

  async function salvar() {
    await updateUser(user.id, userData);
    setEdit(false);
  }

  const isVet = user?.tipo === "veterinario";

  return (
    <>
      <Header user={user} />

      <main
        className={`${poppins.className} min-h-screen bg-[#106944] pt-28 px-6 flex flex-col items-center`}
      >
        <div className="bg-[#FF8F63] text-white font-semibold text-lg px-6 py-2 rounded-full shadow-md mb-8">
          PERFIL - VETERINÁRIO
        </div>

        <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow space-y-4">
          {userData ? (
            <>
              <div>
                <label className="font-bold text-gray-600">Nome</label>
                <input
                  disabled={!isVet || !edit}
                  value={userData.nome}
                  onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                  className="w-full border p-2 rounded mt-1 text-gray-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600">E-mail</label>
                <input
                  disabled
                  value={userData.email}
                  className="w-full border p-2 rounded mt-1 bg-gray-200 text-gray-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600">CRMV</label>
                <input
                  disabled={!isVet || !edit}
                  value={userData.crmv || ""}
                  onChange={(e) => setUserData({ ...userData, crmv: e.target.value })}
                  className="w-full border p-2 rounded mt-1 text-gray-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600">Especialidade</label>
                <input
                  disabled={!isVet || !edit}
                  value={userData.especialidade || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, especialidade: e.target.value })
                  }
                  className="w-full border p-2 rounded mt-1 text-gray-600"
                />
              </div>

              {isVet ? (
                edit ? (
                  <button
                    onClick={salvar}
                    className="bg-[#0b6b53] text-white py-3 rounded-lg w-full mt-4 font-bold"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => setEdit(true)}
                    className="bg-[#0b6b53] text-white py-3 rounded-lg w-full mt-4 font-bold"
                  >
                    Editar Informações
                  </button>
                )
              ) : (
                <div className="text-gray-600 mt-2">
                  Você está visualizando como tutor.
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-600">Carregando...</div>
          )}
        </div>
      </main>
    </>
  );
}