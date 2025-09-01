import { useEffect, useState } from "react";
import CardEvenement from "@/components/evenements/CardEvenement";

export default function CarousselEvenements() {
  const cards = [
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
    { date: "Vendredi 2 Aout", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
  ];

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(2);

  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width < 640) setVisible(1);
      else if (width < 1024) setVisible(2);
      else if (width < 1536) setVisible(3);
      else setVisible(4);

      setCurrent(0); // reset pour éviter cartes tronquées
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const cardWidth = 100 / visible;

  const nextSlide = () => {
    // Si la dernière carte visible est la dernière du tableau => reset à 0
    if (current + visible >= cards.length) {
      setCurrent(0);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (current === 0) {
      setCurrent(cards.length - visible);
    } else {
      setCurrent((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * cardWidth}%)` }}>
        {cards.map((item, index) => (
          <div key={index} style={{ flex: `0 0 ${cardWidth}%`, boxSizing: "border-box", padding: "0.5rem" }}>
            <CardEvenement
              date={item.date}
              discipline={item.discipline}
              gender={item.gender}
              categorie={item.categorie}
              tour={item.tour}
              lieu={item.lieu}
              heure={item.heure}
            />
          </div>
        ))}
      </div>

      {/* Boutons navigation */}
  <button
    onClick={prevSlide}
    className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-50"
    style={{ left: '-20px' }}
  >
    ‹
  </button>

  {/* Flèche droite */}
  <button
    onClick={nextSlide}
    className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
    style={{ right: '-20px' }}
  >
    ›
  </button>
    </div>
  );
}
