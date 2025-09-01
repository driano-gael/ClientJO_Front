import CardEvenement from "@/components/evenements/CardEvenement";

export default function DisplayedEvenements(){
  return (
    <>
      <div className="flex gap-2">
          <CardEvenement></CardEvenement>
          <CardEvenement></CardEvenement>
      </div>
    </>
  )
}