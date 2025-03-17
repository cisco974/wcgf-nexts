// app/actions/games.ts
"use server";

import { revalidatePath } from "next/cache";
import gameService from "@services/gameService";

/**
 * Server Action pour ajouter un nouveau jeu
 */
export async function addGame(formData: FormData) {
  const key = formData.get("key") as string;
  const title = formData.get("title") as string;
  const subtitle = (formData.get("subtitle") as string) || null;

  if (!key || !title) {
    throw new Error("Key and title are required");
  }

  // Créer le jeu en utilisant le service
  await gameService.createGame({
    key,
    title,
    subtitle,
  });

  // Revalider le cache pour que les changements soient visibles
  revalidatePath("/admin/games");
  revalidatePath("/");
}

/**
 * Server Action pour obtenir tous les jeux
 */
export async function getGames() {
  return gameService.getGames();
}

/**
 * Server Action pour obtenir un jeu par son ID
 */
export async function getGameById(id: number) {
  return gameService.getGameById(id);
}

/**
 * Server Action pour mettre à jour un jeu
 */
export async function updateGame(id: number, formData: FormData) {
  const key = formData.get("key") as string;
  const title = formData.get("title") as string;
  const subtitle = (formData.get("subtitle") as string) || null;

  if (!key || !title) {
    throw new Error("Key and title are required");
  }

  const game = await gameService.updateGame(id, {
    key,
    title,
    subtitle,
  });

  revalidatePath(`/admin/games/${id}`);
  revalidatePath("/admin/games");
  revalidatePath("/");
  return game;
}

/**
 * Server Action pour supprimer un jeu
 */
export async function deleteGame(id: number) {
  await gameService.deleteGame(id);

  revalidatePath("/admin/games");
  revalidatePath("/");
}
