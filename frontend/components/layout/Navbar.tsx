import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-6 z-50">
      <div className="text-xl font-bold tracking-tighter text-cyan-400">ABYSS AI</div>
      <div className="flex gap-8 text-[10px] tracking-[0.3em] text-cyan-800 uppercase font-bold">
        <Link href="/" className="hover:text-cyan-400 transition-all">Inici</Link>
        <Link href="/narrative" className="hover:text-cyan-400 transition-all">Narrativa</Link>
        <Link href="/room" className="hover:text-cyan-400 transition-all">Sala 01</Link>
        <Link href="/profile" className="hover:text-cyan-400 transition-all">Perfil</Link>
      </div>
    </nav>
  );
}

