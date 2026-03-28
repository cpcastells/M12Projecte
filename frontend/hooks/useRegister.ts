import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth/authService";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

const useRegister = () =>
  useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerUser,
  });

export default useRegister;
