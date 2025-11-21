"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/componentes/header";
import {
  getConsultaById,
  finalizarConsulta,
  cancelarConsulta,
  getPetById
} from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function RegistrarAtendimento({ params }: any) {
  const router = useRouter();

  const [consulta, setConsulta] = useState<any>(null);
  const [pet, setPet] = useState<any>(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [procedimentos, setProcedimentos] = useState("");
  const [medicacao, setMedicacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  const pc = typeof window !== "undefined" ? localStorage.getItem("pc_user") : null;
  const user = pc ? JSON.parse(pc) : null;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const c = await getConsultaById(params.id);
    setConsulta(c);
    const p = await getPetById(c.petId);
    setPet(p);
  }

  async function salvarRegistro() {
    await finalizarConsulta(consulta.id, {
      diagnostico,
      procedimentos,
      medicacao,
      observacoes
    });
    router.push("/vet/historico");
  }

  async function cancelar() {
    await cancelarConsulta(consulta.id, motivoCancelamento);
    router.push("/vet/historico");
  }

  const isVet = user?.tipo === "veterinario";

  return (
    <>
      <Header user={user} />

      <main className="pt-28 max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-[#0b6b53] mb-4">
          Registrar Atendimento
        </h1>

        {consulta && pet ? (
          <>
            <div className="bg-white shadow p-4 rounded-lg mb-6">
              <p><strong>Pet:</strong> {pet.nome}</p>
              <p><strong>Data:</strong> {consulta.data}</p>
              <p><strong>Hora:</strong> {consulta.hora}</p>
              <p><strong>Status:</strong> {consulta.status}</p>
            </div>

            {!isVet && (
              <div className="text-gray-600 bg-yellow-100 p-3 rounded-lg mb-4">
                Você está visualizando como tutor. Apenas veterinários podem alterar.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <textarea
                disabled={!isVet}
                placeholder="Diagnóstico"
                className="p-3 border rounded-lg"
                onChange={(e) => setDiagnostico(e.target.value)}
              />

              <textarea
                disabled={!isVet}
                placeholder="Procedimentos"
                className="p-3 border rounded-lg"
                onChange={(e) => setProcedimentos(e.target.value)}
              />

              <textarea
                disabled={!isVet}
                placeholder="Medicação"
                className="p-3 border rounded-lg"
                onChange={(e) => setMedicacao(e.target.value)}
              />

              <textarea
                disabled={!isVet}
                placeholder="Observações"
                className="p-3 border rounded-lg"
                onChange={(e) => setObservacoes(e.target.value)}
              />

              {isVet && (
                <>
                  <button
                    onClick={salvarRegistro}
                    className="bg-[#0b6b53] text-white py-3 rounded-lg font-bold"
                  >
                    Salvar Registro
                  </button>

                  <textarea
                    placeholder="Motivo do Cancelamento"
                    className="p-3 border rounded-lg"
                    onChange={(e) => setMotivoCancelamento(e.target.value)}
                  />

                  <button
                    onClick={cancelar}
                    className="bg-red-600 text-white py-3 rounded-lg font-bold"
                  >
                    Cancelar Consulta
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div>Carregando...</div>
        )}
      </main>
    </>
  );
}