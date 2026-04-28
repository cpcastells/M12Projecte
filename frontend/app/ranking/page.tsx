"use client";

import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";

type RankingUser = {
  position: number;
  userId: number;
  username: string;
  completedGames: number;
};

function RankingPage() {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadRanking() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

        const res = await fetch(`${apiUrl}/ranking`);

        if (!res.ok) {
          throw new Error("Error carregant el rànquing");
        }

        const data = await res.json();
        setRanking(data);
      } catch (error) {
        console.error("Error loading ranking:", error);
        setErrorMessage("No s'ha pogut carregar el rànquing.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRanking();
  }, []);

  return (
    <main className="min-h-screen bg-abyss-bg text-cyan-50 font-mono flex flex-col">
      <Navbar />

      <section className="flex-1 border-t border-cyan-900/30 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10">
            <p className="text-cyan-700 text-[10px] tracking-[0.4em] mb-2 uppercase">
              Classificació global
            </p>
            <h1 className="text-5xl font-black tracking-tighter text-cyan-400 mb-4">
              Rànquing
            </h1>
            <p className="text-cyan-100/60 text-sm max-w-xl">
              Llistat d’usuari ordenat per partides guanyades.
            </p>
          </header>

          <div className="overflow-hidden border border-cyan-900/30 bg-cyan-950/10">
            <table className="w-full text-left">
              <thead className="bg-cyan-950/30 text-cyan-500 text-[10px] tracking-[0.3em] uppercase">
                <tr>
                  <th className="p-4">Posició</th>
                  <th className="p-4">Usuari</th>
                  <th className="p-4">Victòries</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-cyan-700">
                      Carregant rànquing...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-red-400">
                      {errorMessage}
                    </td>
                  </tr>
                ) : ranking.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-cyan-700">
                      No hi ha dades encara.
                    </td>
                  </tr>
                ) : (
                  ranking.map((user) => (
                    <tr
                      key={user.userId}
                      className="border-t border-cyan-900/30 hover:bg-cyan-950/30 transition-colors"
                    >
                      <td className="p-4 font-black text-cyan-400">
                        {user.position === 1 && "🥇"}
                        {user.position === 2 && "🥈"}
                        {user.position === 3 && "🥉"}
                        {user.position > 3 && `#${user.position}`}
                      </td>

                      <td className="p-4 text-cyan-100">{user.username}</td>

                      <td className="p-4 text-cyan-300 font-bold">
                        {user.completedGames}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RankingPage;
