"use client";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/constants/paths";
import { useAuth } from "@/context/AuthContext";
import useActiveGame from "@/hooks/useActiveGame";
import useMyProfile from "@/hooks/useMyProfile";
import type { RecentGame } from "@/types/admin.types";

const formatRoomUrl = (order: number): string => String(order).padStart(2, "0");

const formatTime = (iso: string | Date): string => {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const describeGame = (g: RecentGame): string => {
  if (g.status === "active") return "Partida en curs";
  switch (g.endReason) {
    case "success":
      return "✓ Missió completada";
    case "timeExpired":
      return "✗ Temps esgotat";
    case "attemptsExceeded":
      return "✗ Intents exhaurits";
    case "abandoned":
      return "Partida abandonada";
    default:
      return "Partida finalitzada";
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user: authUser } = useAuth();
  const { data: activeGameData } = useActiveGame();
  const { data: profileData, isLoading } = useMyProfile();

  const activeGame =
    activeGameData?.game && activeGameData.game.status === "active"
      ? activeGameData.game
      : null;

  const stats = profileData?.stats;
  const profileUser = profileData?.user;

  const username = profileUser?.username ?? authUser?.username ?? "";
  const email = profileUser?.email ?? authUser?.email ?? "";
  const rank = profileUser?.rank ?? "Recruit";

  const [form, setForm] = useState({ username, email });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | undefined>();

  useEffect(() => {
    setForm({ username, email });
  }, [username, email]);

  useEffect(() => {
    if (!activeGame) return;
    setCurrentRoom(String(activeGame.currentRoom.order));
  }, [activeGame]);

  const achievements = [
    {
      name: "Primer immersió",
      icon: "🌊",
      unlocked: (stats?.gamesPlayed ?? 0) >= 1,
    },
    {
      name: "Observador",
      icon: "👁",
      unlocked: (stats?.gamesPlayed ?? 0) >= 1,
    },
    {
      name: "Primera porta",
      icon: "🔓",
      unlocked: (stats?.gamesCompleted ?? 0) >= 1,
    },
    { name: "Velocista", icon: "🏃", unlocked: false },
    {
      name: "Cara a cara",
      icon: "🤖",
      unlocked: (stats?.totalHintsUsed ?? 0) >= 1,
    },
    {
      name: "Apagada",
      icon: "⚡",
      unlocked: (stats?.gamesTimeExpired ?? 0) >= 1,
    },
    { name: "Descoberta", icon: "🧬", unlocked: (stats?.maxScore ?? 0) >= 100 },
    { name: "Abyss", icon: "🌑", unlocked: (stats?.gamesCompleted ?? 0) >= 3 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const display = (value: number | undefined, suffix = "") =>
    isLoading || value === undefined ? "—" : `${value}${suffix}`;

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
                  <circle
                    cx="24"
                    cy="18"
                    r="10"
                    stroke="rgba(0,229,255,0.6)"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16"
                    stroke="rgba(0,229,255,0.6)"
                    strokeWidth={1.5}
                  />
                </svg>
              </div>

              {editing ? (
                <form
                  onSubmit={handleSave}
                  className="flex flex-col gap-2 w-full"
                >
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
                        setForm({ username, email });
                      }}
                      className="flex-1 px-4 py-2 border border-cyan-900 text-cyan-900 text-xs uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="text-lg font-bold">{username}</div>
                  <div className="text-xs text-cyan-400">{email}</div>
                  <span className="badge badge-amber">Rang: {rank}</span>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 px-6 py-2 border border-cyan-400 text-cyan-400 text-xs uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black transition-all"
                  >
                    Editar Perfil
                  </button>
                </>
              )}

              {success && (
                <div className="text-green-400 text-[10px] mt-2">
                  Perfil actualitzat!
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 w-full text-center text-xs mt-4">
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{display(stats?.gamesPlayed)}</div>
                  Partides
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">
                    {display(stats?.completionRate, "%")}
                  </div>
                  Completat
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{display(stats?.avgScore)}</div>
                  Score mitjà
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{display(stats?.victories)}</div>
                  Victòries
                </div>
              </div>

              {activeGame && (
                <button
                  className="btn-primary w-full mt-4"
                  onClick={() =>
                    router.push(
                      `${PATHS.ROOM}/${formatRoomUrl(activeGame.currentRoom.order)}`,
                    )
                  }
                >
                  {" "}
                  ▶ CONTINUAR PARTIDA
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="btn-secondary w-full"
                onClick={() => router.push(PATHS.NARRATIVE)}
              >
                Nova Partida
              </button>

              <button
                className="btn-secondary w-full border-red-600 text-red-400"
                onClick={() => {
                  logout();
                  router.push(PATHS.LOGIN);
                }}
              >
                Tancar sessió
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-2/3 flex flex-col gap-4">
            {/* Partida Actual */}
            {activeGame && (
              <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4">
                <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">
                  Partida Actual
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-[10px]">
                  <div>
                    <div className="text-muted uppercase mb-1">SALA ACTUAL</div>

                    <div className="text-cyan font-bold text-lg">
                      {" "}
                      Sala {currentRoom} / 03
                    </div>
                  </div>
                  <div>
                    <div className="text-muted uppercase mb-1">INICI</div>
                    <div className="text-secondary text-sm">
                      {formatTime(activeGame.createdAt ?? new Date())}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted uppercase mb-1">ESTAT</div>
                    <span className="badge badge-amber">EN CURS</span>
                  </div>
                </div>
                <div className="text-muted text-[10px] mb-1">
                  PROGRÉS GLOBAL
                </div>
                <div className="w-full h-2 bg-cyan-900 rounded">
                  <div
                    className="h-2 bg-cyan-400 rounded"
                    style={{ width: `${stats?.completionRate ?? 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-muted text-[10px] mt-1">
                  <span>Sala {currentRoom} — Control Central</span>
                  <span>{stats?.completionRate ?? 0}% completat</span>
                </div>
              </div>
            )}

            {/* Rendiment */}
            <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4">
              <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">
                Rendiment
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{display(stats?.avgScore)}</div>
                  <div className="text-[10px] text-cyan-500">Score mitjà</div>
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{display(stats?.maxScore)}</div>
                  <div className="text-[10px] text-cyan-500">Score màxim</div>
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">
                    {display(stats?.totalHintsUsed)}
                  </div>
                  <div className="text-[10px] text-cyan-500">Pistes usades</div>
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">
                    {isLoading ? "—" : (stats?.avgTimeFormatted ?? "00:00")}
                  </div>
                  <div className="text-[10px] text-cyan-500">Temps mitjà</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">
                    {display(stats?.gamesAbandoned)}
                  </div>
                  <div className="text-[10px] text-cyan-500">Abandonades</div>
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">
                    {display(stats?.gamesTimeExpired)}
                  </div>
                  <div className="text-[10px] text-cyan-500">Temps esgotat</div>
                </div>
                <div className="border border-cyan-700 py-2 rounded">
                  <div className="font-bold">{display(stats?.gamesActive)}</div>
                  <div className="text-[10px] text-cyan-500">Actives</div>
                </div>
              </div>
            </div>

            {/* Partides Recents */}
            <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4 text-[10px]">
              <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">
                Partides Recents
              </div>
              {!stats || stats.recentGames.length === 0 ? (
                <div className="text-cyan-700">Sense activitat registrada</div>
              ) : (
                stats.recentGames.map((g) => (
                  <div key={g.id} className="flex gap-2 mb-1">
                    <span className="text-cyan-400">
                      {formatTime(g.createdAt)}
                    </span>
                    <span className="flex-1">{describeGame(g)}</span>
                    <span className="text-cyan-500">{g.score} pts</span>
                  </div>
                ))
              )}
            </div>

            {/* Achievements */}
            <div className="profile-section bg-[#01111a] border border-cyan-800 rounded p-4">
              <div className="profile-section-title text-xs text-cyan-400 uppercase mb-2">
                Assoliments
              </div>
              <div className="grid grid-cols-4 gap-2">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    className={`achievement ${a.unlocked ? "unlocked" : "locked"} border border-cyan-700 rounded py-2 flex flex-col items-center`}
                  >
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
