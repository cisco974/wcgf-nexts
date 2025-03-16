// app/admin/games/add-game-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import gameService from "@services/gameService";

export default function AddGameForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setError(null);

      await await gameService.getGames();
      router.push("/admin/games");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 p-3 rounded text-red-700">{error}</div>
      )}

      <div>
        <label htmlFor="key" className="block text-sm font-medium">
          Key
        </label>
        <input
          type="text"
          name="key"
          id="key"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium">
          Subtitle
        </label>
        <input
          type="text"
          name="subtitle"
          id="subtitle"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Add Game"}
      </button>
    </form>
  );
}
