import HomeCard from "./HomeCard";

export default function HomePresentation() {
  return (
    <section className="mx-[3%] my-[40px] bg-base-100 border-1 border-accent rounded-[20px]">

        <HomeCard
            title="un évènement inoubliable"
            imageSrc="/images/paris_le_monde.png"
            imageAlt="Jeux Olympiques Paris 2024"
            speech=" Plus de 10 500 athlètes venus de 206 pays s'affronteront dans 32 sports. Paris devient, pour la troisième fois, la capitale mondiale du sport."
        />

        <div className="h-[1px] w-[80%] bg-accent mx-auto" />

        <HomeCard
            title="un évènement historique"
            imageSrc="/images/decor_paris.png"
            imageAlt="Monument Paris 2024"
            speech="Les Jeux Olympiques d'été de 2024, officiellement connus sous le nom de Jeux de la XXXIIIe Olympiade, se dérouleront à Paris, en France, du 26 juillet au 11 août 2024."
            orientation="reverse"
        />

        <div className="h-[1px] w-[80%] bg-accent mx-auto" />

        <HomeCard
            title="un évènement populaire"
            imageSrc="/images/paris_la_verte.png"
            imageAlt="Paris la verte 2024"
            speech="Les Jeux Olympiques de Paris 2024 seront les premiers à être organisés dans la capitale française depuis 1924. Ils s'annoncent comme un événement populaire, accessible à tous."
        />

    </section>
  );

}