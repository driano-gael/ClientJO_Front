import {useEvenementByEpreuveId} from "@/hook/useEpreuve";
import {formatDateFr} from "@/utils/formatDate";
import {Epreuve} from "@/type/evenement/epreuve";

type Props = {
  epreuveId: number;
  onClose: () => void;
};

export default function ModalEvenement({epreuveId, onClose}: Props) {
  const {evenement, loading, error} = useEvenementByEpreuveId(epreuveId);

  const groupedEpreuves = evenement
    ? evenement.epreuves.reduce<Record<string, Epreuve[]>>((acc, epreuve) => {
        const discipline = epreuve.discipline.nom;
        (acc[discipline] ??= []).push(epreuve);
        return acc;
      }, {})
    : {};

  return (
    <div className="fixed w-screen h-screen flex justify-center bg-black/70 pt-[20px] z-50">
      <div
        className="bg-white w-[90%] max-w-[600px] h-[85%] relative flex flex-col rounded-[40px] border-4 border-accent">

        {/* Contenu */}
        <div className="flex-1 overflow-auto">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}

          {/* liste des épreuves */}
          {evenement && (
            <>
              {/* Bouton fermer */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-white bg-black rounded-full p-2 hover:bg-black/70 transition"
                >
                  ✕
                </button>
              {/*date*/}
                <div
                  className="text-black text-[130%] font-bold mb-4 mt-4 text-center">{formatDateFr(evenement.date)}</div>
                <hr className="border border-black w-[90%] mx-auto"/>

              {/*evenement*/}
                <div className="mt-4">
                  {/*description*/}
                  <div
                    className="text-black font-bold text-center mx-[10%] py-[8px] bg-accent rounded-[8px]">{evenement.description}</div>
                  {/*liste des épreuves*/}
                  <div className="mt-4 mx-[10%] flex flex-wrap gap-4">
                    {Object.entries(groupedEpreuves).map(([discipline, epreuves]) => (
                      <div key={discipline} className="mb-6">
                        {/* Rupture = titre discipline */}
                        <h2 className="text-lg font-bold text-black mb-2">{discipline}</h2>
                        <div className="flex flex-wrap gap-4">
                          {epreuves.map((epreuve) => (
                            <div
                              key={epreuve.id}
                              className="bg-white rounded-[20px] border border-accent p-2 shadow text-black w-[220px] flex-shrink-0"
                            >
                              <div className="font-semibold">{epreuve.libelle}</div>
                              <div className="text-xs text-gray-500">{epreuve.tour}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
