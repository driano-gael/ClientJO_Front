import CarousselEvenements from "@/components/evenements/CarousselEvenements";

type CardType = {
  date: string;
  discipline: string;
  gender: string;
  categorie: string;
  tour: string;
  lieu: string;
  heure: string;
};

interface CarousselEvenementsProps {
  cards: CardType[];
}

export default function DisplayedEvenements({ cards }: CarousselEvenementsProps) {
  const grouped = cards.reduce((acc: Record<string, CardType[]>, card) => {
    if (!acc[card.discipline]) acc[card.discipline] = [];
    acc[card.discipline].push(card);
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([discipline, events]) => (
        <div key={discipline}>
          {/* Label de la discipline */}
          <h2 className="text-[75%] text-black font-bold">{discipline}</h2>
          <CarousselEvenements cards={events}/>
        </div>
      ))}
    </div>
  );
}
