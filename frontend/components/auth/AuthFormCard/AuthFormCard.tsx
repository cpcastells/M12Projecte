import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface AuthFormCardProps {
  title: string;
  switchPrompt: string;
  switchLink: string;
  switchHref: string;
  children: ReactNode;
  onSubmit?: ComponentPropsWithoutRef<"form">["onSubmit"];
}

const AuthFormCard = ({
  title,
  switchPrompt,
  switchLink,
  switchHref,
  children,
  onSubmit,
}: AuthFormCardProps) => (
  <div className="min-h-screen flex items-center justify-center bg-abyss-bg text-cyan-50">
    <div className="bg-abyss-panel p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {children}
      </form>

      <p className="mt-6 text-center text-sm text-cyan-600">
        {switchPrompt}{" "}
        <Link
          href={switchHref}
          className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
        >
          {switchLink}
        </Link>
      </p>
    </div>
  </div>
);

export default AuthFormCard;
