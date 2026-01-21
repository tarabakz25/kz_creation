import gsap from "gsap";
import { useLayoutEffect, useState } from "react";
import MenuItem from "~/shared/components/layouts/menuItem";
import Loading from "~/shared/components/loading";
import { PageTransitionProvider } from "~/shared/components/pageTransition";

// Check first visit before render
const getIsFirstVisit = () => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("hasVisited") !== "true";
};

export default function IndexPage() {
  const [isFirstVisit] = useState(getIsFirstVisit);
  const [showLoading, setShowLoading] = useState(isFirstVisit);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("hasVisited", "true");
    document.documentElement.removeAttribute("data-first-visit");
    setShowLoading(false);

    // Animate content in after loading
    const smoothWrapper = document.getElementById("smooth-wrapper");
    if (smoothWrapper) {
      gsap.fromTo(
        smoothWrapper,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  };

  // If not first visit, ensure content is visible
  useLayoutEffect(() => {
    if (!isFirstVisit) {
      const smoothWrapper = document.getElementById("smooth-wrapper");
      if (smoothWrapper) {
        gsap.set(smoothWrapper, { opacity: 1, y: 0 });
      }
    }
  }, [isFirstVisit]);

  return (
    <PageTransitionProvider>
      {showLoading && <Loading onComplete={handleLoadingComplete} />}
      <main className="px-[5vw] py-[10vh] h-screen">
        <div className="flex flex-col items-start w-full min-h-screen text-white gap-8">
          <h1 className="text-3xl font-futura_pt tracking-wider">
            Welcome to Kz Creation portfolio.
          </h1>
          <MenuItem />
        </div>
      </main>
    </PageTransitionProvider>
  );
}
