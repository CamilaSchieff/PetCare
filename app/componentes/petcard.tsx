"use client";

export default function PetCard({ pet, onClick }: { pet: any; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ border:"1px solid #ddd", padding:12, borderRadius:8, cursor: onClick ? "pointer" : "auto" }}>
      <div style={{ fontWeight:700 }}>{pet.nome}</div>
      <div style={{ fontSize:13, color:"#555" }}>{pet.especie} — {pet.raca}</div>
    </div>
  );
}
