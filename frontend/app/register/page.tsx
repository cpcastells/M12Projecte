"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput/FormInput";
import FormButton from "@/components/ui/FormButton/FormButton";
import AuthFormCard from "@/components/auth/AuthFormCard/AuthFormCard";
import { REGISTER_COPY } from "@/constants/copy/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: React.ComponentPropsWithoutRef<"form">["onSubmit"] = (
    e,
  ) => {
    e.preventDefault();
    // TODO: connectar amb l'API de registre
  };

  return (
    <AuthFormCard
      title={REGISTER_COPY.title}
      switchPrompt={REGISTER_COPY.switchPrompt}
      switchLink={REGISTER_COPY.switchLink}
      switchHref={REGISTER_COPY.switchHref}
      onSubmit={handleSubmit}
    >
      <FormInput
        type="email"
        placeholder={REGISTER_COPY.fields.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormInput
        type="password"
        placeholder={REGISTER_COPY.fields.password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormButton>{REGISTER_COPY.submit}</FormButton>
    </AuthFormCard>
  );
};

export default RegisterPage;
