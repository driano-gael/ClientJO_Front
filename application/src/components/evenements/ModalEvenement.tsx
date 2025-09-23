import {useEvenementByEpreuveId} from "@/hook/useEpreuve";
import {formatDateFr, formatHeure} from "@/utils/formatDate";
import {Epreuve} from "@/type/evenement/epreuve";
import { useAuth } from "@/context/userContext";
import {useEffect, useState} from "react";
import ModalAuthentication from "@/components/connexion/modalAuthentication";
import CardOffre from "@/components/evenements/CardOffre";
import DisplayedOffre from "@/components/evenements/DisplayedOffre";

type Props = {
  epreuveId: number;
  onClose: () => void;
};

export default function ModalEvenement({epreuveId, onClose}: Props) {
  const {evenement, loading, error} = useEvenementByEpreuveId(epreuveId);
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [remainingTickets, setRemainingTickets] = useState<number>(0);
  const groupedEpreuves = evenement
    ? evenement.epreuves.reduce<Record<string, Epreuve[]>>((acc, epreuve) => {
        const discipline = epreuve.discipline.nom;
        (acc[discipline] ??= []).push(epreuve);
        return acc;
      }, {})
    : {};

  useEffect(() => {
  if (evenement) {
    setRemainingTickets(evenement.nb_place_restante);
  }
}, [evenement]);

  console.log("ModalEvenement rendu, isAuthenticated:", isAuthenticated);

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
                  <div className="mt-4 mx-[10%] gap-2">
                    {Object.entries(groupedEpreuves).map(([discipline, epreuves]) => (
                      <div key={discipline} className="mb-6">
                        {/* Rupture = titre discipline */}
                        <div className="text-lg font-bold text-black mb-2 rounded-[20px] border border-accent w-[90%]">
                          <h2 className="pl-4 text-lg font-bold text-black">{discipline}</h2>
                        </div>
                        <div className="pl-3">
                          {epreuves.map((epreuve) => (
                            <div
                              key={epreuve.id}
                              className="bg-white text-black flex gap-2"

                            >
                              <div className="font-semibold"> {epreuve.tour}</div>
                              <div className="font-semibold"> {epreuve.genre}</div>
                              <div className="">{epreuve.libelle}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                {/* lieu */}
                  <hr className="border border-black w-[85%] mx-auto"/>
                  <div className="text-black my-2 font-bold text-center mx-[10%] py-[8px] bg-base-200 rounded-[8px]">
                    <div>{evenement.lieu.nom}</div>
                    <div> A partir de : {formatHeure(evenement.horraire)}</div>
                    <div> PLACES RESTANTE : {remainingTickets}</div>
                  </div>
                  <hr className="border border-black w-[85%] mx-auto"/>
                {/*  {gestion de l'offre*/}
                <div className="text-black my-4 text-center mx-[10%]">
                  {isAuthenticated ? (
                    <div>
                      <DisplayedOffre/>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-lg mb-3">Connectez-vous pour voir les offres</h3>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/80 transition"
                      >
                        Se connecter
                      </button>
                    </div>
                  )}
                </div>

                </div>
            </>
          )}
        </div>
      </div>

      {/* Modal d'authentification */}
      {showAuthModal && (
        <ModalAuthentication onCloseAction={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
