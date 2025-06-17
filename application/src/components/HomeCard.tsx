import Image from 'next/image';

type Props = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  speech: string;
  orientation?: 'normal' | 'reverse';
};

export default function HomeCard({
  title,
  imageSrc,
  imageAlt,
  speech,
  orientation = 'normal',
}: Props) {

    const isReverse = orientation === 'reverse';
    const baseDirection = isReverse ? 'flex-col-reverse' : 'flex-col';
    const smDirection = isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row';

  return (
  <div className={`m-4 flex flex-col ${smDirection} items-stretch gap-6 h-[400px] lg:h-80 `}>
  
    <div className="w-full lg:w-1/2 relative h-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover rounded-lg"
      />
    </div>

    <div className="w-full lg:w-1/2 h-full flex flex-col justify-between">
      <div className="w-full text-center">
        <h2 className="text-[16px] xs:text-[20px] md:text-[24px] font-bold">{title}</h2>
      </div>
      <div className={`flex-1 flex items-center justify-center xs:${isReverse ? 'justify-end' : 'justify-start'} `}>
        <p className="text-gray-700 text-[12px] xs:text-[16px] md:text-[20px] xl:leading-[2.5]">{speech}</p>
      </div>
  </div>

</div>
)}
