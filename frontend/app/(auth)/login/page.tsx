"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput/FormInput";
import FormButton from "@/components/ui/FormButton/FormButton";
import AuthFormCard from "@/components/auth/AuthFormCard/AuthFormCard";
import { LOGIN_COPY } from "@/constants/copy/auth";
import { validateEmail, validatePassword } from "@/utils/validation";
import useLogin from "@/hooks/useLogin";
import { ApiError } from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
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
    setApiError(null);
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.token);
          router.push("/");
        },
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
      {apiError && (
        <p className="text-red-400 text-sm text-center">{apiError}</p>
      )}
      <FormButton disabled={!isValid || isPending}>
        {isPending ? "Entrant..." : LOGIN_COPY.submit}
      </FormButton>
    </AuthFormCard>
  );
};

export default LoginPage;
