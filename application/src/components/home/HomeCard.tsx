import Image from 'next/image';

/**
 * Props du composant HomeCard
 */
export type HomeCardProps = {
  /** Titre de la carte */
  title: string;
  /** Source de l'image */
  imageSrc: string;
  /** Texte alternatif de l'image */
  imageAlt: string;
  /** Texte de présentation */
  speech: string;
  /** Orientation de la carte (normale ou inversée) */
  orientation?: 'normal' | 'reverse';
};

/**
 * Composant de carte de présentation pour la page d'accueil
 * Affiche une image avec un titre et un texte descriptif
 * @param props - Les propriétés du composant
 * @returns {JSX.Element} Carte de présentation
 */
export default function HomeCard({
  title,
  imageSrc,
  imageAlt,
  speech,
  orientation = 'normal',
}: HomeCardProps) {

    const isReverse = orientation === 'reverse';
    const smDirection = isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row';

  return (
  <div className={`m-[4%] flex flex-col ${smDirection} items-center lg:items-stretch gap-6 h-[400px] lg:h-80 `}>
  
    <div className="w-full lg:w-[55%] relative h-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover rounded-[20px]"
      />
    </div>

    <div className="w-full lg:w-[45%] h-[150px] lg:h-full flex flex-col justify-between">
      <div className="w-full text-center">
        <h2 className="text-[16px] xs:text-[20px] md:text-[24px] font-bold">{title}</h2>
      </div>
      <div className={`flex-1 flex items-center justify-center ${isReverse ? 'lg:justify-end' : 'lg:justify-start'}`}>
        <p className={`text-gray-700 text-[12px] xs:text-[16px] md:text-[20px] xl:leading-[2.5] 
          text-center ${isReverse ? 'lg:text-right' : 'lg:text-left'}`}
        >
          {speech}
        </p>
      </div>
  </div>

</div>
)}
