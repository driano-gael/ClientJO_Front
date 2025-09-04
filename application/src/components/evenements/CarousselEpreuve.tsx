import { useState, useEffect } from "react";
import {EpreuveCardType} from "@/type/evenement/epreuve";
import CardEpreuve from "@/components/evenements/CardEpreuve";

interface Props {
  epreuves?: EpreuveCardType[];
}

export default function CarousselEpreuve({ epreuves = [] }: Props) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(2);
  const [startX, setStartX] = useState<number | null>(null);

  // Calcul dynamique du nombre de cartes visibles
  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      setVisible(Math.ceil(width / 250));
      setCurrent(0);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, [epreuves]);

  const cardWidth = 100 / visible;

  // Navigation boutons
  const nextSlide = () => {
    if (current + visible >= epreuves.length) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  const prevSlide = () => {
    if (current === 0) {
      setCurrent(epreuves.length - visible);
    } else {
      setCurrent(current - 1);
    }
  };

  // Swipe tactile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const diff = startX - e.touches[0].clientX;
    if (diff > 50) {
      nextSlide();
      setStartX(null);
    } else if (diff < -50) {
      prevSlide();
      setStartX(null);
    }
  };

  return (
    <div className="relative w-full overflow-visible">
      <div className="overflow-hidden bg-base-300 rounded-tl-[20px] rounded-br-[20px]">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * cardWidth}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {epreuves.map((epreuve, index) => (
          <div
            key={index}
            style={{
              flex: `0 0 ${cardWidth}%`,
              maxWidth: `${cardWidth}%`,
              boxSizing: "border-box",
              padding: "0.5rem",
            }}
          >
            <CardEpreuve epreuve={epreuve} />
          </div>
        ))}
      </div>
      </div>

      {/* Boutons navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
        style={{ left: "-15px" }}
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
        style={{ right: "-15px" }}
      >
        ›
      </button>
    </div>
  );
}




