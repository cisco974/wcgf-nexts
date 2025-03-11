// src/lib/globals.ts
// Ce service fonctionne comme un singleton global accessible de partout
// Plus moderne que les cookies et utilisable côté serveur et client

/**
 * Service global pour stocker et accéder aux paramètres de l'application
 * Fonctionne comme un singleton et est accessible de partout, y compris
 * dans les composants serveur Next.js et le middleware
 */

// Type pour l'état global
interface GlobalState {
  locale: string;
  game: string;
}

// État par défaut
const defaultState: GlobalState = {
  locale: "en",
  game: "tarot",
};

// Variable globale pour stocker l'état entre les requêtes
const globalState: GlobalState = { ...defaultState };

/**
 * Interface publique du service global
 */
const globals = {
  /**
   * Définit la locale
   */
  setLocale(locale: string) {
    globalState.locale = locale;
  },

  /**
   * Récupère la locale actuelle
   */
  getLocale(): string {
    return globalState.locale;
  },

  /**
   * Définit le jeu actuel
   */
  setGame(game: string) {
    globalState.game = game;
  },

  /**
   * Récupère le jeu actuel
   */
  getGame(): string {
    return globalState.game;
  },

  /**
   * Définit à la fois la locale et le jeu
   */
  setParams(locale: string, game: string) {
    globalState.locale = locale;
    globalState.game = game;
  },

  /**
   * Récupère tous les paramètres
   */
  getParams(): GlobalState {
    return { ...globalState };
  },
};

export default globals;
