'use client';
import Header from "@/components/header/Header";
import CarousselEpreuve from "@/components/evenements/CarousselEpreuve";
import SearchEvenements from "@/components/evenements/searchEvenements";
import DisplayedEpreuves from "@/components/evenements/DisplayedEpreuves";
import {useEpreuvesCards} from "@/hook/useEpreuve";


export default function Evenements() {
  const {epreuves, loading, error} = useEpreuvesCards()

  if (loading) return <p>Chargement des épreuves...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  return (
    <>
      <Header/>
        <div className="bg-base-200">
            <div  className="w-[90%] mx-auto">
                <div className="pt-4 pb-4">
                  <SearchEvenements/>
                </div>

                <div>
                    <p className="font-extrabold text-black">A VENIR</p>
                    <hr className="border-1 border-black"/>
                  <div className="my-1">
                    <CarousselEpreuve epreuves={epreuves}/>
                  </div>
                </div>

            <div>
                <p className="font-extrabold text-black">TOUT LES EVENEMENTS</p>
                <hr className="border-1 border-black"/>
                <DisplayedEpreuves epreuves={epreuves}/>
            </div>
      </div>
</div>
    </>
  );
}