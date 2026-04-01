"use client"; // Només si necessites hooks com useState o useRouter

import Navbar from "@/components/layout/Navbar";

function ExtraPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <h1 className="text-5xl font-bold mb-6">Secció Extra</h1>
      <p className="text-lg text-center max-w-xl">
        Aquí pots afegir contingut accessible des de la homepage o del joc.
      </p>
    </main>
  );
}
export default ExtraPage;
