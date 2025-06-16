import Link from "next/link";

export default function HomeDescription() {
  return (
    <section className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-center my-8">
            Bienvenue aux jeux olympiques de Paris <br/>2024
        </h1>
        <p className="text-lg text-center mb-8 font-bold">
            Rejoignez nous pour une expérience historique du 26 Juillet au 11 Aout!
        </p>
        <button className="btn btn-accent border-1 border-black text-black font-bold rounded-full">
            <Link href="/offre">PRENEZ PLACE</Link>
        </button>   
    </section>
  );
}