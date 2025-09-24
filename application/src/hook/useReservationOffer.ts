import { useState } from "react";

export type ReservedOffer = {
  offreId: number;
  quantity: number;
};

export function useReservation() {
  const [reservedOffers, setReservedOffers] = useState<ReservedOffer[]>([]);

  const reservePlaces = (offreId: number) => {
    setReservedOffers(prev => {
      const existing = prev.find(o => o.offreId === offreId);
      if (existing) {
        return prev.map(o =>
          o.offreId === offreId ? { ...o, quantity: o.quantity + 1 } : o
        );
      } else {
        return [...prev, { offreId, quantity: 1 }];
      }
    });
  };

  const unReservePlaces = (offreId: number) => {
    setReservedOffers(prev => {
      const existing = prev.find(o => o.offreId === offreId);
      if (!existing) return prev;

      if (existing.quantity <= 1) {
        return prev.filter(o => o.offreId !== offreId);
      } else {
        return prev.map(o =>
          o.offreId === offreId ? { ...o, quantity: o.quantity - 1 } : o
        );
      }
    });
  };

  return { reservedOffers, reservePlaces, unReservePlaces};
}
