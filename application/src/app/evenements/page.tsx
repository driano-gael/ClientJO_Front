'use client';
import Header from "@/components/header/Header";

export default function Evenements() {
  return (
    <>
      <Header/>
      <section className="flex flex-col justify-center bg-base-200 text-black">
        <div className="mt-10">
          <h1 className="text-4xl font-bold text-center mb-6">Bienvenue aux Jeux Olympiques de Paris 2024 !</h1>
          <p className="text-lg text-center max-w-3xl mx-auto">
          decouvrez tout les evenements des JO</p>
        </div>
      </section>

    </>
  );
}