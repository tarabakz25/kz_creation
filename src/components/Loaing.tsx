import { useEffect, useRef, useState } from "react";
import type { Context } from "gsap";

const Loading: React.FC = () => {
  const [isDone, setIsDone] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const completedTextRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    let ctx: Context | undefined;
    let fallbackTimer: number | undefined;
    let fadeOutTimer: number | undefined;

    const totalDuration = 2;
    const letterRevealDuration = 0.45;
    const underlineDuration = 1.1;
    const completedRevealDuration = 0.3;
    const completedHold = 0.25;
    const dissolveDuration = 0.35;
    const completedStart = underlineDuration;

    const finish = () => {
      if (isMounted) setIsDone(true);
    };

    const startFallback = () => {
      if (!isMounted || typeof window === "undefined") return;
      if (fallbackTimer !== undefined) return;

      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = "1";
        wrapperRef.current.style.visibility = "visible";
        wrapperRef.current.style.transition = "opacity 0.35s ease";
      }

      const initialGroup = loadingTextRef.current;
      const completedGroup = completedTextRef.current;
      const underline = underlineRef.current;

      if (underline) {
        underline.style.transformOrigin = "left center";
        underline.style.transition = `transform ${underlineDuration}s ease`;
        underline.style.transform = "scaleX(1)";
      }

      if (initialGroup && completedGroup) {
        window.setTimeout(() => {
          initialGroup.style.opacity = "0";
          completedGroup.style.display = "flex";
          completedGroup.style.opacity = "1";
          completedGroup.style.visibility = "visible";
        }, completedStart * 1000);
      }

      fadeOutTimer = window.setTimeout(() => {
        if (wrapperRef.current) {
          wrapperRef.current.style.opacity = "0";
        }
      }, Math.max(totalDuration - dissolveDuration, 0) * 1000);

      fallbackTimer = window.setTimeout(finish, totalDuration * 1000);
    };

    import("gsap").then(({ default: gsap }) => {
      if (!isMounted) return;

      if (!wrapperRef.current || !loadingTextRef.current || !completedTextRef.current || !underlineRef.current) {
        startFallback();
        return;
      }

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        startFallback();
        return;
      }

      ctx = gsap.context(() => {
        const loadingLetters = Array.from(
          loadingTextRef.current?.querySelectorAll<HTMLElement>(".loading-letter") ?? []
        );
        const completedLetters = Array.from(
          completedTextRef.current?.querySelectorAll<HTMLElement>(".completed-letter") ?? []
        );
        const underline = underlineRef.current;

        if (!loadingLetters.length || !underline || !completedLetters.length) {
          startFallback();
          return;
        }

        gsap.set(wrapperRef.current, { autoAlpha: 1 });
        gsap.set(loadingLetters, { yPercent: 100, opacity: 0 });
        gsap.set(completedTextRef.current, { autoAlpha: 0, display: "none" });
        gsap.set(completedLetters, { y: 10, opacity: 0, filter: "blur(0px)" });
        gsap.set(underline, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap
          .timeline({
            onComplete: finish,
          })
          .to(loadingLetters, {
            yPercent: 0,
            opacity: 1,
            duration: letterRevealDuration,
            stagger: letterRevealDuration / Math.max(loadingLetters.length, 1),
            ease: "power3.out",
          })
          .to(
            underline,
            {
              scaleX: 1,
              duration: underlineDuration,
              ease: "power2.inOut",
            },
            0
          )
          .to(
            loadingLetters,
            {
              y: -12,
              opacity: 0,
              duration: 0.28,
              ease: "power2.in",
            },
            completedStart - 0.2
          )
          .set(loadingTextRef.current, { autoAlpha: 0, display: "none" })
          .set(completedTextRef.current, { autoAlpha: 1, display: "flex" })
          .to(completedLetters, {
            opacity: 1,
            y: 0,
            duration: completedRevealDuration,
            stagger: completedRevealDuration / Math.max(completedLetters.length, 1),
            ease: "power2.out",
          })
          .to(
            completedLetters,
            {
              opacity: 0,
              y: -16,
              filter: "blur(10px)",
              duration: dissolveDuration,
              ease: "power2.in",
            },
            `+${completedHold}`
          )
          .to(
            underline,
            {
              opacity: 0,
              duration: dissolveDuration,
              ease: "power2.inOut",
            },
            `>`
          )
          .to(
            wrapperRef.current,
            {
              autoAlpha: 0,
              scale: 1.05,
              duration: dissolveDuration,
              ease: "power2.inOut",
            },
            `>`
          );
      }, wrapperRef);
    });

    return () => {
      isMounted = false;
      ctx?.revert();
      if (fallbackTimer !== undefined && typeof window !== "undefined") {
        window.clearTimeout(fallbackTimer);
      }
      if (fadeOutTimer !== undefined && typeof window !== "undefined") {
        window.clearTimeout(fadeOutTimer);
      }
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
      aria-live="polite"
      aria-label="Loading site"
    >
      <div className="flex flex-col items-center gap-7">
        <div
          ref={loadingTextRef}
          className="flex gap-2 text-3xl font-semibold uppercase tracking-[0.35em]"
        >
          {[..."Loding..."].map((letter, index) => (
            <span key={`loading-${index}`} className="loading-letter inline-block">
              {letter}
            </span>
          ))}
        </div>

        <div
          ref={completedTextRef}
          className="invisible flex gap-2 text-3xl font-semibold tracking-[0.35em] opacity-0"
        >
          {[..."Completed!"].map((letter, index) => (
            <span key={`completed-${index}`} className="completed-letter inline-block">
              {letter}
            </span>
          ))}
        </div>

        <div className="mt-2 h-[2px] w-60 overflow-hidden rounded-full bg-white/20">
          <div
            ref={underlineRef}
            className="loading-underline h-full w-full bg-white/90"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
