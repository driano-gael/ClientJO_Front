import { useEvenementByEpreuveId } from "@/hook/useEpreuve";

type Props = {
  epreuveId: number;
  onClose: () => void;
};

export default function ModalEvenement({ epreuveId, onClose }: Props) {
  const { evenement, loading, error } = useEvenementByEpreuveId(epreuveId);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full h-full md:w-auto md:h-auto max-w-4xl max-h-[90vh] rounded-lg p-4 relative flex flex-col">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
        >
          ✕
        </button>

        {/* Contenu */}
        <div className="flex-1 overflow-auto">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}

          {/* liste des épreuves */}
          {evenement && (
            <>
              <div className="text-black mb-4">{evenement.description}</div>
              <ul>
                {evenement.epreuves.map((epreuve) => (
                  <li className="text-black" key={epreuve.id}>
                    {epreuve.libelle} - {epreuve.discipline.nom} - {epreuve.tour}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
