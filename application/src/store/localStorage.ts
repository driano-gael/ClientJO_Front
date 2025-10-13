import {PanierState} from "@/type/achat/offrePanier";

/**
 * Charge l'état du panier depuis le localStorage
 * @returns L'état du panier sauvegardé ou undefined si aucun état n'est trouvé
 * @example
 * const savedCart = loadState();
 * if (savedCart) {
 *   // Restaurer le panier
 * }
 */
export const loadState = () => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return undefined;
    }
    const serializedState = localStorage.getItem("panier");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};

/**
 * Sauvegarde l'état du panier dans le localStorage
 * @param state - L'état du panier à sauvegarder
 * @example
 * saveState({ items: [{ evenementId: 1, offreId: 2, quantity: 1 }] });
 */
export const saveState = (state: PanierState) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      // On est côté serveur, pas de localStorage
      return;
    }
    const serializedState = JSON.stringify(state);
    localStorage.setItem("panier", serializedState);
  } catch {
    // Silencieusement ignorer les erreurs de sauvegarde
  }
};