// import CardEvenement from "@/components/evenements/CardEvenement";
import {useState} from "react";

export default function CarousselEvenements(){
const images = [
    { src: "https://picsum.photos/id/1018/600/300", title: "Image 1" },
    { src: "https://picsum.photos/id/1015/600/300", title: "Image 2" },
    { src: "https://picsum.photos/id/1019/600/300", title: "Image 3" },
    { src: "https://picsum.photos/id/1020/600/300", title: "Image 4" },
    { src: "https://picsum.photos/id/1021/600/300", title: "Image 5" },
    { src: "https://picsum.photos/id/1022/600/300", title: "Image 6" }
  ];

  const [current, setCurrent] = useState(0);
  const visible = 3; // nombre d’images visibles

  const nextSlide = () => {
    if (current >= images.length - visible) {
      setCurrent(0); // boucle au début
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (current === 0) {
      setCurrent(images.length - visible); // boucle à la fin
    } else {
      setCurrent((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Zone visible */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            width: `${(images.length / visible) * 100}%`,
            transform: `translateX(-${(current * 100) / images.length}%)`
          }}
        >
          {images.map((item, index) => (
            <div
              key={index}
              className="p-2"
              style={{ width: `${100 / images.length}%` }}
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full aspect-video object-cover rounded-t-2xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons toujours visibles */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ›
      </button>
    </div>
  );
}