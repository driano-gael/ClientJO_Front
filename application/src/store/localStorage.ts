import {PanierState} from "@/type/achat/offrePanier";

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

export const saveState = (state: PanierState) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      // On est côté serveur, pas de localStorage
      return;
    }
    const serializedState = JSON.stringify(state);
    localStorage.setItem("panier", serializedState);
  } catch {

  }
};