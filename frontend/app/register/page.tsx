"use client";

import React, { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02080a] text-cyan-50">
      <div className="bg-[#041823] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>

        <form className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-[#02080a] text-cyan-50 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-[#02080a] text-cyan-50 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Botón */}
          <button
            type="submit"
            className="mt-4 p-3 bg-cyan-600 text-[#02080a] font-bold rounded-lg hover:bg-cyan-500 transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
