import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/auth/authService";
import type { LoginRequest, LoginResponse } from "@/types/auth";

const useLogin = () =>
  useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
  });

export default useLogin;
