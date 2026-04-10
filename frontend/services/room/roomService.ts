import type { RoomResponse } from "@/types/room";
import { ENDPOINTS } from "@/services/endpoints";
import { request } from "@/services/apiClient";

export const getRoomById = (roomId: number): Promise<RoomResponse> =>
  request<RoomResponse>(ENDPOINTS.room.getById(roomId));
