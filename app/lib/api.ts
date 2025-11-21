// src/lib/api.ts
export const API_BASE = "http://localhost:3001";

export async function fetchJSON(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// auth
export async function login(email: string, senha: string) {
  const users = await fetchJSON(`/users?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
  return users[0] || null;
}
export async function registerUser(payload: any) {
  return fetchJSON(`/users`, { method: "POST", body: JSON.stringify(payload) });
}

// users
export async function getUserById(id: number) {
  const users = await fetchJSON(`/users?id=${id}`);
  return users[0] || null;
}
export async function getVets() {
  return fetchJSON(`/users?tipo=veterinario`);
}

// pets
// 🟢 CORREÇÃO 1: Adicionando a função getPets para listar todos os pets
export async function getPets() {
  return fetchJSON(`/pets`);
}
export async function getPetsByTutor(tutorId: number) {
  return fetchJSON(`/pets?tutorId=${tutorId}`);
}
export async function getPetById(id: number) {
  // 🟢 CORREÇÃO 2: Garantir que o retorno tenha as propriedades esperadas 
  // (nome, raca, especie, imagemUrl, tutorId)
  const pet = await fetchJSON(`/pets?id=${id}`).then(r => r[0] || null);
  
  if (!pet) return null;

  // Adicionar campos simulados caso não existam no JSON Server, 
  // para evitar erros de 'Property does not exist' nas páginas.
  return {
    ...pet,
    raca: pet.raca || 'Raça não informada',
    especie: pet.especie || 'Espécie não informada',
    imagemUrl: pet.imagemUrl || '/default-pet.png', // URL de imagem padrão
    tutorId: pet.tutorId, // O tutorId é crucial
  };
}
export async function addPet(payload: any) {
  return fetchJSON(`/pets`, { method: "POST", body: JSON.stringify(payload) });
}
export async function updatePet(id: number, payload: any) {
  return fetchJSON(`/pets/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

// consultas
export async function getConsultasByTutor(tutorId: number) {
  return fetchJSON(`/consultas?tutorId=${tutorId}`);
}
export async function getConsultasByVet(vetId: number) {
  return fetchJSON(`/consultas?vetId=${vetId}`);
}
export async function getAllConsultas() {
  return fetchJSON(`/consultas`);
}
export async function createConsulta(payload: any) {
  return fetchJSON(`/consultas`, { method: "POST", body: JSON.stringify(payload) });
}
export async function updateConsulta(id: number, payload: any) {
  return fetchJSON(`/consultas/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}
// NOVO: Função para obter consulta por ID
export async function getConsultaById(id: number) {
  return fetchJSON(`/consultas?id=${id}`).then(r => r[0] || null);
}

// helper: check vet availability for a specific date+hora
export async function isVetAvailable(vetId: number, data: string, hora: string) {
  const conf = await fetchJSON(`/consultas?vetId=${vetId}&data=${data}&hora=${hora}`);
  return (conf.length === 0);
}