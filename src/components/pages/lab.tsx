import { useEffect, useState } from "react";

interface Work {
  name: string;
  url: string;
  image: string;
  tags: string[];
}

export default function Lab() {
  const [works, setWorks] = useState<Work[]>([]);

  useEffect(() => {
    const workFiles = [
      "adobe-max-2023.json",
      "business-card.json",
      "esg.json",
      "japan-ai-hackathon-2025.json",
      "kanikanlab.json",
      "kz-creation.json",
    ];

    Promise.all(
      workFiles.map((file) =>
        fetch(`/src/content/works/${file}`)
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Failed to load ${file}:`, err);
            return null;
          }),
      ),
    ).then((results) => {
      const validWorks = results.filter((work): work is Work => work !== null);
      setWorks(validWorks);
    });
  }, []);

  return (
    <main className="w-full h-full overflow-y-auto overflow-x-hidden pt-24">
      <div className="flex flex-col w-full min-h-full">
        <div className="w-full columns-1 space-y-4 mx-auto">
          {works.map((work, index) => (
            <div
              key={index}
              className="break-inside-avoid relative group rounded-xl overflow-hidden"
            >
              <img
                src={work.image}
                alt={work.name}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                <h2 className="text-white font-eurostile text-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {work.name}
                </h2>
                <div className="flex flex-wrap gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {work.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs font-futura text-white/90 bg-white/20 px-2 py-1 rounded-full backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
