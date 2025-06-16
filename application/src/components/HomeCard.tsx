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
    const smDirection = isReverse ? 'sm:flex-row-reverse' : 'sm:flex-row';

  return (
    <div className={`m-4 flex ${baseDirection} ${smDirection} items-center gap-6`}>
      
        <div className="w-1/2 max-w-[300px]">
            <Image
            src={imageSrc}
            alt={imageAlt || ''}
            width={300}
            height={200}
            className="w-full h-auto object-cover rounded-lg"
            />
        </div>
        
        <div className="w-1/2">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700">{speech}</p>
        </div>
    </div>
  );
}
