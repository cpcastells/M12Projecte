"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authRequest } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import { Room } from "@/types/game";

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    order: 0,
    isInitial: false,
  });

  useEffect(() => {
    if (!roomId) return;

    authRequest<Room>(`${ENDPOINTS.admin.rooms}/${roomId}`)
      .then((data) => {
        setRoom(data);
        setFormData({
          name: data.name,
          description: data.description,
          image: data.image || "",
          order: data.order,
          isInitial: data.isInitial,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    setSaving(true);
    try {
      await authRequest(ENDPOINTS.admin.updateRoom(roomId), "PATCH", formData);
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Error updating room:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading) return <div className="p-6">Carregant...</div>;
  if (!room) return <div className="p-6">Sala no trobada</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Editar Sala: {room.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nom de la sala"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Descripció</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Descripció de la sala"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Imatge (URL)</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="imagen de la sala (opcional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ordre</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isInitial"
              checked={formData.isInitial}
              onChange={handleChange}
              className="mr-2"
            />
            És la sala inicial
          </label>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {saving ? "Guardant..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/rooms")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel·lar
          </button>
        </div>
      </form>
    </div>
  );
}
