// lib/api-admin.js
/**
 * Fonction pour récupérer les données de page d'un jeu
 * @param {string} gameKey - Clé du jeu
 * @param {string} gamePage - Type de page
 * @param {string} locale - Langue
 * @returns {Promise<Object>} - Données de la page
 */
async function fetchGamePage(
  gameKey: string,
  gamePage: string,
  locale: string,
) {
  // Utiliser HTTP au lieu de HTTPS pour éviter les problèmes de certificat
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://wcgf-back.test";
  const apiUrl = `${apiBaseUrl}/api/v1/games/${gameKey}/pages/${gamePage}?lang=${locale}`;

  console.log(`🔍 API Request started: ${apiUrl}`);

  try {
    // Ajouter un timeout pour éviter les requêtes bloquées
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      next: {
        revalidate: 3600, // Revalider une fois par heure
      },
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    // Toujours nettoyer le timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    // Traiter la réponse JSON
    const data = await response.json();
    console.log(`✅ API Request successful for ${gameKey}/${gamePage}`);

    return data;
  } catch (error: unknown) {
    console.error("Failed to fetch game data:", error);

    // Ajouter des informations de diagnostic supplémentaires
    console.error(
      `URL: ${apiUrl}, gameKey: ${gameKey}, gamePage: ${gamePage}, locale: ${locale}`,
    );

    // Vérifier si error est une instance d'Error avant d'accéder à message
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch game page: ${errorMessage}`);
  }
}

export default fetchGamePage;
