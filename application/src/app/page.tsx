import Header from "@/components/header/Header";
import HomeDescription from "@/components/HomeDescription";
import HomePresentation from "@/components/HomePresentation";

export default function Home() {
  return (
    <>
      <Header/>
      <section className="flex flex-col justify-center bg-base-200 text-black">
        <HomeDescription />
        <HomePresentation/>
      </section>
  
    </>
  );
}
