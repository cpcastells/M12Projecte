"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput/FormInput";
import FormButton from "@/components/ui/FormButton/FormButton";
import AuthFormCard from "@/components/auth/AuthFormCard/AuthFormCard";
import { REGISTER_COPY } from "@/constants/copy/auth";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utils/validation";
import useRegister from "@/hooks/useRegister";
import { ApiError } from "@/services/apiClient";

const RegisterPage = () => {
  const router = useRouter();
  const { mutate, isPending } = useRegister();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    username: string | null;
    email: string | null;
    password: string | null;
  }>({
    username: null,
    email: null,
    password: null,
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (touched.username) {
      setErrors((prev) => ({ ...prev, username: validateUsername(value) }));
    }
  };

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

  const handleBlur = (field: "username" | "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validators = {
      username: validateUsername,
      email: validateEmail,
      password: validatePassword,
    };
    const value = { username, email, password }[field];
    setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
  };

  const isValid =
    !validateUsername(username) &&
    !validateEmail(email) &&
    !validatePassword(password);

  const handleSubmit: React.ComponentPropsWithoutRef<"form">["onSubmit"] = (
    e,
  ) => {
    e.preventDefault();
    setApiError(null);
    mutate(
      { email, password, username },
      {
        onSuccess: () => router.push("/login"),
        onError: (error) => {
          setApiError(
            error instanceof ApiError
              ? error.message
              : "Error de connexió amb el servidor",
          );
        },
      },
    );
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
        type="text"
        placeholder={REGISTER_COPY.fields.username}
        value={username}
        onChange={handleUsernameChange}
        onBlur={() => handleBlur("username")}
        error={touched.username ? errors.username : null}
      />
      <FormInput
        type="email"
        placeholder={REGISTER_COPY.fields.email}
        value={email}
        onChange={handleEmailChange}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : null}
      />
      <FormInput
        type="password"
        placeholder={REGISTER_COPY.fields.password}
        value={password}
        onChange={handlePasswordChange}
        onBlur={() => handleBlur("password")}
        error={touched.password ? errors.password : null}
      />
      {apiError && (
        <p className="text-red-400 text-sm text-center">{apiError}</p>
      )}
      <FormButton disabled={!isValid || isPending}>
        {isPending ? "Registrant..." : REGISTER_COPY.submit}
      </FormButton>
    </AuthFormCard>
  );
};

export default RegisterPage;
