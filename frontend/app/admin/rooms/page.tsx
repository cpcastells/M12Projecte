"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import { Room } from "@/types/game";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    authRequest<Room[]>(ENDPOINTS.admin.rooms)
      .then(setRooms)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Gestió de Sales</h1>

      {rooms.map((room) => (
        <div key={room.id} className="border p-3 mb-2">
          <Link href={`/admin/rooms/${room.id}`}>
            <strong>{room.name}</strong>
          </Link>
          <p>{room.description}</p>
        </div>
      ))}
    </div>
  );
}
