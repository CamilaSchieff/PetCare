export const API_BASE = "http://localhost:3001";

export async function fetchJSON(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function login(email: string, senha: string) {
  const users = await fetchJSON(`/users?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
  return users[0] || null;
}

export async function registerUser(payload: any) {
  return fetchJSON(`/users`, { method: "POST", body: JSON.stringify(payload) });
}

export async function getUserById(id: number) {
  const users = await fetchJSON(`/users?id=${id}`);
  return users[0] || null;
}

export async function getVets() {
  return fetchJSON(`/users?tipo=veterinario`);
}

export async function getPetsByTutor(tutorId: number) {
  return fetchJSON(`/pets?tutorId=${tutorId}`);
}

export async function getPetById(id: number) {
  return fetchJSON(`/pets?id=${id}`).then(r => r[0] || null);
}

export async function addPet(payload: any) {
  return fetchJSON(`/pets`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updatePet(id: number, payload: any) {
  return fetchJSON(`/pets/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function getConsultasByTutor(tutorId: number) {
  return fetchJSON(`/consultas?tutorId=${tutorId}`);
}

export async function getConsultasByVet(vetId: string) {
  return fetchJSON(`/consultas?vetId=${vetId}`);
}

export async function getAllConsultas() {
  return fetchJSON(`/consultas`);
}

export async function getConsultaById(id: number) {
  return fetchJSON(`/consultas?id=${id}`).then(r => r[0] || null);
}

export async function createConsulta(payload: any) {
  const pet = await getPetById(payload.petId);
  const tutor = await getUserById(payload.tutorId);

  const enriched = {
    ...payload,
    petNome: pet?.nome || "Desconhecido",
    tutorNome: tutor?.nome || "Desconhecido"
  };

  return fetchJSON(`/consultas`, {
    method: "POST",
    body: JSON.stringify(enriched),
  });
}

export async function updateConsulta(id: number, payload: any) {
  return fetchJSON(`/consultas/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function getConsultasDoDia(vetId: number) {
  const hoje = new Date().toISOString().split("T")[0];
  return fetchJSON(`/consultas?vetId=${vetId}&data=${hoje}&status=confirmada`);
}

export async function getConsultasPendentes(vetId: string) {
  return fetchJSON(`/consultas?vetId=${vetId}&status=pendente`);
}

export async function getConsultasConfirmadas(vetId: string) {
  return fetchJSON(`/consultas?vetId=${vetId}&status=confirmada`);
}

export async function getConsultasFinalizadas(vetId: string) {
  return fetchJSON(`/consultas?vetId=${vetId}&status=finalizada`);
}

export async function isVetAvailable(vetId: number, data: string, hora: string) {
  const conf = await fetchJSON(`/consultas?vetId=${vetId}&data=${data}&hora=${hora}`);
  return (conf.length === 0);
}

export async function finalizarConsulta(id: number, payload: any) {
  return fetchJSON(`/consultas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "finalizada",
      ...payload,
    }),
  });
}

export async function cancelarConsulta(id: number, motivo: string) {
  return fetchJSON(`/consultas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "cancelada",
      motivoCancelamento: motivo,
    }),
  });
}

export async function updateUser(id: number, payload: any) {
  return fetchJSON(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}