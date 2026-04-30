"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  AdminUser,
  UserStats,
  UserStatsResponse,
  GameEndReason,
} from "@/types/admin.types";

// Ajuda

type SortField = "id" | "username" | "email" | "games";
type SortDir = "asc" | "desc";

function endReasonLabel(endReason: GameEndReason | null): string {
  if (!endReason) return "● Activa";
  if (endReason === "success") return "✓ Completada";
  if (endReason === "abandoned") return "✗ Abandonada";
  if (endReason === "timeExpired") return "⏱ Temps esgotat";
  if (endReason === "attemptsExceeded") return "✗ Intents esgotats";
  return "—";
}

function endReasonColor(endReason: GameEndReason | null): string {
  if (!endReason) return "text-cyan-400";
  if (endReason === "success") return "text-emerald-400";
  if (endReason === "abandoned") return "text-red-400";
  if (endReason === "timeExpired") return "text-amber-400";
  return "text-red-400";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Modal d'estadístiques

function StatsModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authRequest<UserStatsResponse>(ENDPOINTS.admin.userStats(user.id))
      .then((res) => setStats(res.stats))
      .catch(() => setError("No s'han pogut carregar les estadístiques"))
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(1,13,22,0.92)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl border border-cyan-800 bg-[#010d16] rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Capçalera */}
        <div className="flex items-center justify-between border-b border-cyan-900 px-6 py-4">
          <div>
            <div className="text-[10px] tracking-[0.4em] text-cyan-800 uppercase mb-1">
              Fitxa de jugador
            </div>
            <h2 className="text-lg font-black tracking-widest text-cyan-400 uppercase">
              {user.username}
            </h2>
            <p className="text-xs text-cyan-700 mt-0.5">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] tracking-widest uppercase px-2 py-1 border font-bold ${user.role === "admin" ? "border-amber-700 text-amber-400" : "border-cyan-900 text-cyan-600"}`}
            >
              {user.role}
            </span>
            <button
              onClick={onClose}
              className="text-cyan-700 hover:text-cyan-400 transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contingut */}
        <div className="px-6 py-6">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="text-cyan-700 text-xs tracking-widest animate-pulse uppercase">
                Carregant estadístiques...
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-400 text-xs text-center py-10">
              {error}
            </div>
          )}

          {stats && (
            <div className="space-y-6">
              {/* Mètriques principals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Jugades",
                    value: stats.gamesPlayed,
                    color: "text-cyan-400",
                  },
                  {
                    label: "Completades",
                    value: stats.gamesCompleted,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Abandonades",
                    value: stats.gamesAbandoned,
                    color: "text-red-400",
                  },
                  {
                    label: "T. esgotat",
                    value: stats.gamesTimeExpired,
                    color: "text-amber-400",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="border border-cyan-900/60 bg-cyan-950/10 p-3 text-center"
                  >
                    <div className={`text-2xl font-black ${m.color}`}>
                      {m.value}
                    </div>
                    <div className="text-[10px] text-cyan-800 tracking-widest uppercase mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Barra de completat */}
              <div>
                <div className="flex justify-between text-[10px] text-cyan-700 uppercase tracking-widest mb-1">
                  <span>Taxa d&apos;èxit</span>
                  <span className="text-cyan-400">{stats.completionRate}%</span>
                </div>
                <div className="h-1.5 bg-cyan-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-700"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Estadístiques secundàries */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  {
                    label: "Puntuació màx.",
                    value: stats.maxScore,
                    suffix: "pts",
                  },
                  {
                    label: "Puntuació mitjana",
                    value: stats.avgScore,
                    suffix: "pts",
                  },
                  {
                    label: "Pistes gastades",
                    value: stats.totalHintsUsed,
                    suffix: "",
                  },
                ].map((s) => (
                  <div key={s.label} className="border border-cyan-900/40 p-3">
                    <div className="text-lg font-bold text-cyan-300">
                      {s.value}
                      {s.suffix && (
                        <span className="text-xs text-cyan-700 ml-1">
                          {s.suffix}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-cyan-800 tracking-widest uppercase mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Temps mitjà */}
              <div className="border border-cyan-900/40 p-3 flex items-center justify-between">
                <span className="text-[10px] text-cyan-700 tracking-widest uppercase">
                  Temps mitjà per partida
                </span>
                <span className="text-cyan-400 font-mono font-bold text-sm">
                  {stats.avgTimeFormatted === "00:00"
                    ? "—"
                    : `${stats.avgTimeFormatted} min`}
                </span>
              </div>

              {/* Últimes partides */}
              {stats.recentGames.length > 0 && (
                <div>
                  <div className="text-[10px] text-cyan-800 tracking-widest uppercase mb-2">
                    Últimes partides
                  </div>
                  <div className="space-y-1">
                    {stats.recentGames.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between text-xs border border-cyan-900/30 px-3 py-2"
                      >
                        <span className="text-cyan-800">#{g.id}</span>
                        <span
                          className={`font-mono ${endReasonColor(g.endReason)}`}
                        >
                          {endReasonLabel(g.endReason)}
                        </span>
                        <span className="text-cyan-600">
                          {g.score} pts · {g.hintsUsed} pistes
                        </span>
                        <span className="text-cyan-800">
                          {formatDate(g.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pàgina principal
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authRequest<{ users: AdminUser[] }>(
        ENDPOINTS.admin.users,
      );
      setUsers(res.users);
    } catch {
      setError("No s'han pogut carregar els usuaris");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleRoleToggle(user: AdminUser) {
    const newRole = user.role === "admin" ? "user" : "admin";
    setRoleLoading(user.id);
    try {
      await authRequest(ENDPOINTS.admin.userRole(user.id), "PATCH", {
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
    } catch {
    } finally {
      setRoleLoading(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await authRequest(ENDPOINTS.admin.deleteUser(deleteTarget.id), "DELETE");
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
    } finally {
      setDeleteLoading(false);
    }
  }

  const filtered = users
    .filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortField === "games") {
        av = a._count?.games ?? 0;
        bv = b._count?.games ?? 0;
      } else {
        av = a[sortField] ?? 0;
        bv = b[sortField] ?? 0;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <span className="text-cyan-900 ml-1">↕</span>;
    return (
      <span className="text-cyan-400 ml-1">
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-[#010d16] text-cyan-50 font-mono flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.5em] text-cyan-900 uppercase mb-1">
            Administració — Gestió d&apos;Usuaris
          </div>
          <h1 className="text-3xl font-black tracking-widest text-cyan-400 uppercase">
            JUGADORS
          </h1>
          <p className="text-cyan-800 text-xs mt-1">
            {users.length} usuaris registrats
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Cercar per nom o correu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border border-cyan-900 text-cyan-300 placeholder-cyan-800 px-4 py-2 text-xs tracking-wide focus:outline-none focus:border-cyan-600 transition-colors"
          />
          <button
            onClick={fetchUsers}
            className="border border-cyan-900 hover:border-cyan-600 text-cyan-700 hover:text-cyan-400 px-4 py-2 text-xs tracking-widest uppercase transition-colors"
          >
            ↺ Recarregar
          </button>
        </div>

        {error && (
          <div className="border border-red-900 text-red-400 text-xs px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-cyan-800 text-xs tracking-widest animate-pulse uppercase text-center py-20">
            Carregant usuaris...
          </div>
        ) : (
          <>
            <div className="border border-cyan-900 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cyan-900 text-cyan-700 uppercase tracking-widest">
                    <th
                      className="text-left px-4 py-3 cursor-pointer hover:text-cyan-500 select-none"
                      onClick={() => toggleSort("id")}
                    >
                      ID
                      <SortIcon field="id" />
                    </th>
                    <th
                      className="text-left px-4 py-3 cursor-pointer hover:text-cyan-500 select-none"
                      onClick={() => toggleSort("username")}
                    >
                      Usuari
                      <SortIcon field="username" />
                    </th>
                    <th
                      className="text-left px-4 py-3 cursor-pointer hover:text-cyan-500 select-none hidden sm:table-cell"
                      onClick={() => toggleSort("email")}
                    >
                      Correu
                      <SortIcon field="email" />
                    </th>
                    <th className="text-left px-4 py-3">Rol</th>
                    <th
                      className="text-left px-4 py-3 cursor-pointer hover:text-cyan-500 select-none"
                      onClick={() => toggleSort("games")}
                    >
                      Partides
                      <SortIcon field="games" />
                    </th>
                    <th className="text-right px-4 py-3">Accions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-cyan-800 py-12 tracking-widest"
                      >
                        Cap usuari trobat
                      </td>
                    </tr>
                  )}
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-cyan-900/40 hover:bg-cyan-950/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-cyan-700">#{user.id}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-cyan-300 hover:text-cyan-100 font-bold tracking-wide transition-colors text-left"
                        >
                          {user.username}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-cyan-600 hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 border text-[10px] tracking-widest uppercase font-bold ${user.role === "admin" ? "border-amber-700 text-amber-400" : "border-cyan-900 text-cyan-600"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-cyan-500">
                        {user._count?.games ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-cyan-700 hover:text-cyan-400 transition-colors px-2 py-1 border border-transparent hover:border-cyan-800 text-[10px] tracking-widest uppercase"
                          >
                            Stats
                          </button>
                          <button
                            onClick={() => handleRoleToggle(user)}
                            disabled={roleLoading === user.id}
                            className="text-amber-700 hover:text-amber-400 transition-colors px-2 py-1 border border-transparent hover:border-amber-900 text-[10px] tracking-widest uppercase disabled:opacity-40"
                          >
                            {roleLoading === user.id
                              ? "..."
                              : user.role === "admin"
                                ? "↓ User"
                                : "↑ Admin"}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="text-red-800 hover:text-red-400 transition-colors px-2 py-1 border border-transparent hover:border-red-900 text-[10px] tracking-widest uppercase"
                          >
                            ✕ Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-[10px] text-cyan-800 mt-2 tracking-widest uppercase">
              {filtered.length} de {users.length} usuaris
            </div>
          </>
        )}
      </div>

      {selectedUser && (
        <StatsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(1,13,22,0.92)" }}
        >
          <div className="border border-red-900 bg-[#010d16] p-6 max-w-sm w-full">
            <div className="text-[10px] tracking-[0.4em] text-red-800 uppercase mb-2">
              Confirmació requerida
            </div>
            <p className="text-cyan-300 text-sm mb-1">
              Eliminar{" "}
              <span className="font-bold text-cyan-100">
                {deleteTarget.username}
              </span>
              ?
            </p>
            <p className="text-cyan-700 text-xs mb-6">
              Aquesta acció és irreversible. S&apos;eliminaran totes les
              partides associades.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="border border-cyan-900 text-cyan-600 hover:text-cyan-400 px-4 py-2 text-xs tracking-widest uppercase transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="border border-red-800 text-red-400 hover:bg-red-950/30 px-4 py-2 text-xs tracking-widest uppercase transition-colors disabled:opacity-40"
              >
                {deleteLoading ? "Eliminant..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
