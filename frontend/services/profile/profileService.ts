import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ProfileResponse } from "@/types/profile.types";

export function getMyProfile(): Promise<ProfileResponse> {
  return authRequest<ProfileResponse>(ENDPOINTS.profile.me);
}
