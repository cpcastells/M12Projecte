import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import { ENDPOINTS } from "@/services/endpoints";
import { request } from "@/services/apiClient";

export const loginUser = (data: LoginRequest): Promise<LoginResponse> =>
  request<LoginResponse>(ENDPOINTS.auth.login, "POST", data);

export const registerUser = (
  data: RegisterRequest,
): Promise<RegisterResponse> =>
  request<RegisterResponse>(ENDPOINTS.auth.register, "POST", data);
