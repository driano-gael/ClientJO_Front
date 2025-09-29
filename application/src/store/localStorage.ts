import {PanierState} from "@/type/achat/offrePanier";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("panier");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Impossible de charger l'état depuis localStorage", e);
    return undefined;
  }
};

export const saveState = (state: PanierState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("panier", serializedState);
  } catch (e) {
    console.warn("Impossible de sauvegarder l'état dans localStorage", e);
  }
};