"use client";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, DEFAULT_USER } from "@/constants/copy/profile";

export default function ProfilePage() {

  const router = useRouter();
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [form, setForm] = useState<User>({ ...DEFAULT_USER });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  //Arxius estaticos
  const achievements = [
    { name: "Primer immersió", icon: "🌊", unlocked: true },
    { name: "Observador", icon: "👁", unlocked: true },
    { name: "Primera porta", icon: "🔓", unlocked: false },
    { name: "Velocista", icon: "🏃", unlocked: false },
    { name: "Cara a cara", icon: "🤖", unlocked: false },
    { name: "Apagada", icon: "⚡", unlocked: false },
    { name: "Descoberta", icon: "🧬", unlocked: false },
    { name: "Abyss", icon: "🌑", unlocked: false },
  ];
  // Registre de activitats estàtic per mostrar a la pàgina de perfil.
  const gameLog = [
    { time: "04:32", text: "Accés a l'estació Hadal-7 iniciat. Connexió establerta." },
    { time: "04:35", text: "Entrada a Sala 01 — Control Central. Enigma activat." },
    { time: "04:38", text: "Inspeccionat Terminal A. Anomalia detectada al log d'error." },
    { time: "04:41", text: "Inspeccionat Panel de Control. Nivell d'oxigen crític: 17%." },
    { time: "04:44", text: "Intent de codi incorrecte. Intents restants: 3." },
  ];

  //Manejor de formulari d'edició de perfil
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser({ ...user, username: form.username, email: form.email });
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

    //Fetch de la partida activa
    useEffect(() => {
    const loadActiveGame = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/game/me/active", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) return;

        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          currentRoom: data.currentRoom,
          completion: data.completion,
          startDate: data.startDate,
          status: "EN CURS",
        }));
      } catch (err) {
        console.error("Error fetching active game:", err);
      }
    };

      // Llamamos a la función async
        loadActiveGame();
    }, []);
     return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />

      <div className="flex flex-col px-6 pt-20 gap-8 max-w-7xl mx-auto w-full">
        <div className="flex gap-6">
          {/* Left Panel */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="profile-card bg-[#01111a] border border-cyan-800 rounded p-6 flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="w-24 h-24 border border-cyan-400 rounded flex items-center justify-center">
                <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16">
                  <circle cx="24" cy="18" r="10" stroke="rgba(0,229,255,0.6)" strokeWidth={1.5}/>
                  <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="rgba(0,229,255,0.6)" strokeWidth={1.5}/>
                </svg>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Nom d'usuari"
                    className="px-4 py-2 bg-[#02080a] border border-cyan-800 rounded text-xs placeholder-cyan-600 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Correu electrònic"
                    className="px-4 py-2 bg-[#02080a] border border-cyan-800 rounded text-xs placeholder-cyan-600 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 border border-cyan-400 text-cyan-400 text-xs uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black transition-all"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setForm(user);
                      }}
                      className="flex-1 px-4 py-2 border border-cyan-900 text-cyan-900 text-xs uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="text-lg font-bold">{user.username}</div>
                  <div className="text-xs text-cyan-400">{user.email}</div>
                  <span className="badge badge-amber">Rang: {user.rank}</span>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 px-6 py-2 border border-cyan-400 text-cyan-400 text-xs uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black transition-all"
                  >
                    Editar Perfil
                  </button>
                </>
              )}

              {success && <div className="text-green-400 text-[10px] mt-2">Perfil actualitzat!</div>}

              <div className="grid grid-cols-2 gap-2 w-full text-center text-xs mt-4">
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{user.gamesPlayed}</div>Partides
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{user.completion}%</div>Completat
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{user.attempts}</div>Intents
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{user.victories}</div>Victòries
                </div>
              </div>

              <button
              className="btn-primary w-full mt-4"
                onClick={() => router.push(`/sala${user.currentRoom}`)}
               > ▶ CONTINUAR PARTIDA
                </button>
            </div>

            <div className="flex flex-col gap-2">

              {/*Canvis nous Sección de acciones secundarias */ }

              <button className="btn-secondary w-full"  onClick={() => router.push("/narrative ")}
              >
                Nova Partida
              </button>
              {/*Canvis nous Sección de acciones secundarias */ }

              <button className="btn-secondary w-full border-red-600 text-red-400"
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
              >
                Tancar sessió
                </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-2/3 flex flex-col gap-4">

            {/* Partida Actual */}
            <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4">
              <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">Partida Actual</div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-[10px]">
                <div>
                  <div className="text-muted uppercase mb-1">SALA ACTUAL</div>

                  <div className="text-cyan font-bold text-lg"> Sala {user.currentRoom } / 03</div>
                </div>
                <div>
                  <div className="text-muted uppercase mb-1">INICI</div>
                  <div className="text-secondary text-sm">2087.03.14 {user.startDate}</div>
                </div>
                <div>
                  <div className="text-muted uppercase mb-1">ESTAT</div>
                  <span className="badge badge-amber">EN CURS {user.status}</span>
                </div>
              </div>
              <div className="text-muted text-[10px] mb-1">PROGRÉS GLOBAL</div>
              <div className="w-full h-2 bg-cyan-900 rounded">
                <div className="h-2 bg-cyan-400 rounded" style={{ width: `${user.completion}%` }} />
              </div>
              <div className="flex justify-between text-muted text-[10px] mt-1">
                <span>Sala {user.currentRoom} — Control Central</span>
                <span>{user.completion}% completat</span>
              </div>
            </div>

            {/* Game Log */}
            <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4 text-[10px]">
              <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">Registre d&apos;Activitat</div>
              {gameLog.map((entry, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <span className="text-cyan-400">{entry.time}</span>
                  <span>{entry.text}</span>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4">
              <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">Assoliments</div>
              <div className="grid grid-cols-4 gap-2">
                {achievements.map((a, i) => (
                  <div key={i} className={`achievement ${a.unlocked ? "unlocked" : "locked"} border border-cyan-700 rounded py-2 flex flex-col items-center`}>
                    <span className="text-xl">{a.icon}</span>
                    <div className="text-[10px]">{a.name}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
