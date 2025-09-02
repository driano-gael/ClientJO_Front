'use client';
import Header from "@/components/header/Header";
import CarousselEvenements from "@/components/evenements/CarousselEvenements";
import SearchEvenements from "@/components/evenements/searchEvenements";
import DisplayedEvenements from "@/components/evenements/DisplayedEvenements";


const cards = [
  { date: "Vendredi 2 Août", discipline: "BOXE", gender: "Hommes", categorie: "-80Kg", tour: "1/8 DE FINALE", lieu: "Paris Nord Villepinte", heure: "17h" },
  { date: "Samedi 3 Août", discipline: "BOXE", gender: "Femmes", categorie: "-60Kg", tour: "1/4 DE FINALE", lieu: "Paris Nord Villepinte", heure: "14h" },
  { date: "Dimanche 4 Août", discipline: "BOXE", gender: "Hommes", categorie: "-75Kg", tour: "1/2 FINALE", lieu: "Paris Nord Villepinte", heure: "18h" },

  { date: "Vendredi 2 Août", discipline: "JUDO", gender: "Femmes", categorie: "-70Kg", tour: "1/8 DE FINALE", lieu: "Paris Bercy", heure: "15h" },
  { date: "Samedi 3 Août", discipline: "JUDO", gender: "Hommes", categorie: "-81Kg", tour: "1/4 DE FINALE", lieu: "Paris Bercy", heure: "16h" },
  { date: "Dimanche 4 Août", discipline: "JUDO", gender: "Hommes", categorie: "-90Kg", tour: "1/2 FINALE", lieu: "Paris Bercy", heure: "19h" },

  { date: "Vendredi 2 Août", discipline: "NATATION", gender: "Femmes", categorie: "200m nage libre", tour: "SÉRIES", lieu: "Stade Aquatique", heure: "10h" },
  { date: "Samedi 3 Août", discipline: "NATATION", gender: "Hommes", categorie: "100m papillon", tour: "SÉRIES", lieu: "Stade Aquatique", heure: "11h" },
  { date: "Samedi 3 Août", discipline: "NATATION", gender: "Femmes", categorie: "200m brasse", tour: "FINALE", lieu: "Stade Aquatique", heure: "20h" },
  { date: "Dimanche 4 Août", discipline: "NATATION", gender: "Hommes", categorie: "400m 4 nages", tour: "FINALE", lieu: "Stade Aquatique", heure: "21h" },

  { date: "Vendredi 2 Août", discipline: "ATHLÉTISME", gender: "Hommes", categorie: "100m", tour: "SÉRIES", lieu: "Stade de France", heure: "12h" },
  { date: "Samedi 3 Août", discipline: "ATHLÉTISME", gender: "Femmes", categorie: "200m", tour: "SÉRIES", lieu: "Stade de France", heure: "13h" },
  { date: "Samedi 3 Août", discipline: "ATHLÉTISME", gender: "Hommes", categorie: "800m", tour: "1/2 FINALE", lieu: "Stade de France", heure: "17h" },
  { date: "Dimanche 4 Août", discipline: "ATHLÉTISME", gender: "Femmes", categorie: "Marathon", tour: "FINALE", lieu: "Paris Centre", heure: "9h" },

  { date: "Vendredi 2 Août", discipline: "ESCRIME", gender: "Hommes", categorie: "Fleuret", tour: "1/8 DE FINALE", lieu: "Grand Palais", heure: "14h" },
  { date: "Vendredi 2 Août", discipline: "ESCRIME", gender: "Femmes", categorie: "Épée", tour: "1/4 DE FINALE", lieu: "Grand Palais", heure: "15h" },
  { date: "Samedi 3 Août", discipline: "ESCRIME", gender: "Hommes", categorie: "Sabre", tour: "1/2 FINALE", lieu: "Grand Palais", heure: "18h" },
  { date: "Dimanche 4 Août", discipline: "ESCRIME", gender: "Femmes", categorie: "Fleuret", tour: "FINALE", lieu: "Grand Palais", heure: "20h" },
  { date: "Dimanche 4 Août", discipline: "ESCRIME", gender: "Hommes", categorie: "Épée", tour: "FINALE", lieu: "Grand Palais", heure: "21h" },
];




export default function Evenements() {
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
                    <CarousselEvenements cards={cards}/>
                  </div>
                </div>

            <div>
                <p className="font-extrabold text-black">TOUT LES EVENEMENTS</p>
                <hr className="border-1 border-black"/>
                <DisplayedEvenements cards={cards}/>
            </div>
      </div>
</div>
    </>
  );
}