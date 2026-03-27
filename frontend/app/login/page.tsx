"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput/FormInput";
import FormButton from "@/components/ui/FormButton/FormButton";
import AuthFormCard from "@/components/auth/AuthFormCard/AuthFormCard";
import { LOGIN_COPY } from "@/constants/copy/auth";
import { validateEmail, validatePassword } from "@/utils/validation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : password;
    const validate = field === "email" ? validateEmail : validatePassword;
    setErrors((prev) => ({ ...prev, [field]: validate(value) }));
  };

  const isValid = !validateEmail(email) && !validatePassword(password);

  const handleSubmit: React.ComponentPropsWithoutRef<"form">["onSubmit"] = (
    e,
  ) => {
    e.preventDefault();
    // TODO: connectar amb l'API d'autenticació
  };

  return (
    <AuthFormCard
      title={LOGIN_COPY.title}
      switchPrompt={LOGIN_COPY.switchPrompt}
      switchLink={LOGIN_COPY.switchLink}
      switchHref={LOGIN_COPY.switchHref}
      onSubmit={handleSubmit}
    >
      <FormInput
        type="email"
        placeholder={LOGIN_COPY.fields.email}
        value={email}
        onChange={handleEmailChange}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : null}
      />
      <FormInput
        type="password"
        placeholder={LOGIN_COPY.fields.password}
        value={password}
        onChange={handlePasswordChange}
        onBlur={() => handleBlur("password")}
        error={touched.password ? errors.password : null}
      />
      <FormButton disabled={!isValid}>{LOGIN_COPY.submit}</FormButton>
    </AuthFormCard>
  );
};

export default LoginPage;
