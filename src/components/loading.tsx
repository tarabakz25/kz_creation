import gsap from "gsap";
import { useEffect, useState } from "react";

interface LoadingProps {
  onComplete?: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
  const [isClient, setIsClient] = useState(false);
  const rows = isClient ? Math.floor(window.innerHeight / 20) : 30;
  const cols = isClient ? Math.floor(window.innerWidth / 20) : 60;

  const cells = rows * cols;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          onComplete?.();
        }, 300);
      },
    });

    timeline.set(".cell", {
      opacity: 0,
      scale: 0,
      transformOrigin: "center center",
    });

    timeline.to(".cell", {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: {
        amount: 0.6,
        from: "center",
        grid: [rows, cols],
      },
      ease: "power2.out",
    });

    timeline.to(
      ".cell",
      {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        stagger: {
          amount: 0.4,
          from: "center",
          grid: [rows, cols],
        },
        ease: "power2.in",
      },
      "+=0.3",
    );

    return () => {
      timeline.kill();
    };
  }, [isClient, rows, cols, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 8px)`,
          gridTemplateRows: `repeat(${rows}, 8px)`,
        }}
      >
        {Array.from({ length: cells }).map((_, index) => (
          <div key={index} className="bg-white rounded-full w-2 h-2 cell"></div>
        ))}
      </div>
    </div>
  );
}
