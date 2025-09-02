import CarousselEpreuve from "@/components/evenements/CarousselEpreuve";
import {EpreuveCardType} from "@/type/evenement/epreuve";

interface Props {
  epreuves?: EpreuveCardType[];
}

export default function DisplayedEpreuves({ epreuves = [] }: Props) {
  const grouped = epreuves.reduce((acc: Record<string, EpreuveCardType[]>, epreuve) => {
    if (!acc[epreuve.discipline]) acc[epreuve.discipline] = [];
    acc[epreuve.discipline].push(epreuve);
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([discipline, disciplineEpreuves]:[string, EpreuveCardType[]]) => (
        <div key={discipline}>
          {/* Label de la discipline */}
          <h2 className="text-[75%] text-black font-bold">{discipline}</h2>
          <CarousselEpreuve epreuves={disciplineEpreuves}/>
        </div>
      ))}
    </div>
  );
}
