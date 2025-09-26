import { useState } from "react";
import {OffrePanier} from "@/type/achat/offrePanier";


export function useReservation() {
    const [reservedOffers, setReservedOffers] = useState<OffrePanier[]>([]);

    const updateQuantity = (evenementId: number, offreId: number, delta: number) => {
        setReservedOffers(prev => {
            const existing = prev.find(
                o => o.offreId === offreId && o.evenementId === evenementId
            );
            if (!existing && delta > 0) {
                return [...prev, { evenementId, offreId, quantity: delta }];
            }
            if (!existing) return prev;

            const newQuantity = existing.quantity + delta;
            if (newQuantity <= 0) {
                return prev.filter(
                    o => !(o.offreId === offreId && o.evenementId === evenementId)
                );
            }
            return prev.map(o =>
                o.offreId === offreId && o.evenementId === evenementId
                    ? { ...o, quantity: newQuantity }
                    : o
            );
        });
    };

    const reservePlaces = (evenementId: number, offreId: number) =>
        updateQuantity(evenementId, offreId, +1);

    const unReservePlaces = (evenementId: number, offreId: number) =>
        updateQuantity(evenementId, offreId, -1);

    return { reservedOffers, reservePlaces, unReservePlaces };
}
