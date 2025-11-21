"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/componentes/header";
import { registerUser } from "@/app/lib/api";

export default function CadastroPage() {
  const router = useRouter();


  const [tutor, setTutor] = useState({ email: "", username: "", senha: "" });
  const [vet, setVet] = useState({ email: "", username: "", senha: "" });

  const [msg, setMsg] = useState("");

  async function cadastrar(tipo: "tutor" | "veterinario") {
   const dados = tipo === "tutor" ? tutor : vet;


   if (!dados.email.trim() || !dados.username.trim() || !dados.senha.trim()) {
     setMsg("Preencha todos os campos antes de continuar.");
     return;
   }

    try {
     const body = {
        nome: dados.username,
        email: dados.email,
        senha: dados.senha,
        tipo,
        dadosExtras: {}
     };

      await registerUser(body);
      setMsg("Cadastro realizado! Redirecionando para login...");
      setTimeout(() => router.push("/login"), 1500);
    }  catch (e) {
      setMsg("Erro ao cadastrar.");
  }
}

  return (
    <>
    <Header user={null} />

      <main
        style={{
          minHeight: "100vh",
          background: "#106944",
          padding: "90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 className="text-6xl font-extrabold tracking-wide mb-10">
          <span className="text-[#ff9900]">PetCare</span>
          <span className="text-white">+</span>
        </h1>

        <h2 className="text-white text-2xl font-bold mb-6 tracking-wider">
          FAÇA SEU CADASTRO
        </h2>

        <div
          style={{
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 330,
              background: "#fdeee0",
              padding: 30,
              borderRadius: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                color: "#0a6a46",
                textAlign: "center",
                marginBottom: 20,
                fontWeight: 700,
              }}
            >
              PARA TUTORES
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                placeholder="E-mail"
                value={tutor.email}
                onChange={(e) =>
                  setTutor({ ...tutor, email: e.target.value })
                }
                style={inputStyle}
              />

              <input
                placeholder="Usuário"
                value={tutor.username}
                onChange={(e) =>
                  setTutor({ ...tutor, username: e.target.value })
                }
                style={inputStyle}
              />

              <input
                placeholder="Senha"
                type="password"
                value={tutor.senha}
                onChange={(e) =>
                  setTutor({ ...tutor, senha: e.target.value })
                }
                style={inputStyle}
              />

              <button
                onClick={() => cadastrar("tutor")}
                  className="w-full bg-[#0b6b53] text-white py-3 rounded-xl mt-2 text-center font-bold tracking-wider transition duration-300
                  hover:bg-white 
                  hover:text-[#0b6b53] 
                  hover:border-2 hover:border-[#0b6b53] active:scale-[0.98]"
              >
                FAZER CADASTRO
              </button>
            </div>
          </div>

          <div
            style={{
              width: 330,
              background: "#fdeee0",
              padding: 30,
              borderRadius: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                color: "#0a6a46",
                textAlign: "center",
                marginBottom: 20,
                fontWeight: 700,
              }}
            >
              PARA VETERINÁRIOS
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                placeholder="E-mail"
                value={vet.email}
                onChange={(e) => setVet({ ...vet, email: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Usuário"
                value={vet.username}
                onChange={(e) => setVet({ ...vet, username: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Senha"
                type="password"
                value={vet.senha}
                onChange={(e) => setVet({ ...vet, senha: e.target.value })}
                style={inputStyle}
              />

              <button
                onClick={() => cadastrar("veterinario")}
                className="w-full bg-[#0b6b53] text-white py-3 rounded-xl mt-2 text-center font-bold tracking-wider transition duration-300
                  hover:bg-white 
                  hover:text-[#0b6b53] 
                  hover:border-2 hover:border-[#0b6b53] active:scale-[0.98]"
              >
                FAZER CADASTRO
              </button>
            </div>
          </div>
        </div>

        {msg && (
          <p style={{ marginTop: 30, fontSize: 18, fontWeight: 600 }}>
            {msg}
          </p>
        )}
      </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: 30,
  border: "none",
  background: "#ff9c72",
  color: "#fff",
  fontSize: 15,
  fontWeight: 600,
};

const btnStyle: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
  padding: "12px",
  borderRadius: 25,
  background: "#0a6a46",
  color: "#fff",
  border: "none",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};