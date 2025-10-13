import Link from "next/link";


/**
 * Composant décrivant l'accueil et l'appel à l'action.
 *
 * @returns {JSX.Element} Section de description de la page d'accueil.
 */
export default function HomeDescription() {
  return (
    <section className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-center my-8">
            Bienvenue aux jeux olympiques de Paris <br/>2024
        </h1>
        <p className="text-lg text-center mb-8 font-bold">
            Rejoignez nous pour une expérience historique du 26 Juillet au 11 Aout!
        </p>

        <Link 
          href="/evenements"
          className="btn bg-[#FF9900] hover:bg-[#ffb84d] text-black border-[#e17d00] font-bold rounded-full px-12"
        >
          PRENEZ PLACE
        </Link>
    </section>
  );
}