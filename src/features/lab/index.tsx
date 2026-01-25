import { useState } from "react";
import MenuItem from "~/shared/components/layouts/menuItem";
import worksData from "./content/works.json";
import type { ImageMetadata } from "astro";
import { motion, AnimatePresence } from "motion/react";

// Import images
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/content/works/*.{webp,png,jpg,jpeg}",
  { eager: true },
);

// Helper to get image from path
const getImage = (path: string) => {
  const cleanPath = path.replace(/^~/, "/src");
  const imageModule = imagesGlob[cleanPath];
  return imageModule ? imageModule.default : null;
};

const works = worksData
  .map((work) => ({
    ...work,
    imageObj: getImage(work.image),
  }))
  .filter((w) => w.imageObj);

type Work = (typeof works)[0];

export default function LabPage() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  return (
    <main className="h-screen flex justify-between px-[5vw] py-[10vh] overflow-hidden relative">
      {/* Left Section: Static */}
      <div className="flex flex-col items-start w-1/3 h-full text-white gap-8 z-20">
        <h1 className="text-3xl font-futura_pt tracking-wider">My Works.</h1>
        <div>
          <MenuItem />
        </div>
      </div>

      {/* Right Section: Scrollable List */}
      <div className="w-2/3 h-full overflow-y-auto scrollbar-hide flex flex-col items-end gap-8 pb-20 pr-2">
        {works.map((work, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedWork(work)}
            className="group flex flex-col items-end text-right transition-all duration-300 hover:opacity-100 opacity-70"
            whileHover={{ x: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedWork?.name === work.name ? (
              <h2 className="text-2xl text-transparent tracking-wider font-futura_pt leading-none mb-2">
                {work.name}
              </h2>
            ) : (
              <motion.h2
                layoutId={`work-title-${work.name}`}
                className="text-2xl text-white tracking-wider font-futura_pt leading-none mb-2 group-hover:text-primary-400"
              >
                {work.name}
              </motion.h2>
            )}
            <div className="flex gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-avenir text-white/50 px-2 py-0.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Popup */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-transparent"
            onClick={() => setSelectedWork(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="p-6 md:p-10 rounded-2xl max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row gap-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden border border-white/5 bg-white/5 flex-shrink-0">
                <img
                  src={selectedWork.imageObj!.src}
                  alt={selectedWork.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between w-full md:w-1/2 text-white">
                <div>
                  <motion.h3
                    layoutId={`work-title-${selectedWork.name}`}
                    className="text-3xl font-bold font-avenir mb-4"
                  >
                    {selectedWork.name}
                  </motion.h3>
                  <div className="flex flex-wrap gap-1 mb-6">
                    {selectedWork.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm text-white/70 font-avenir px-2 py-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedWork.url ? (
                  <a
                    href={selectedWork.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-avenir tracking-wider text-white px-6 py-3 hover:text-primary-400 transition-colors mt-4 md:mt-0"
                  >
                    <span>Visit Website</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ) : (
                  <div className="text-white/40 font-avenir tracking-wider text-sm mt-4 md:mt-0">
                    No public URL available
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
