import React, { useEffect, useRef } from "react";
import "@fontsource/fugaz-one";

type Props = {
  words: string[];
  hold?: number;
  fade?: number;
  className?: string;
};

const MainPageAnimation: React.FC<Props> = ({
  words,
  hold = 1.4,
  fade = 0.4,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let scrollReleased = false;
    const animations: any[] = [];
    let originalText = "";

    const lockScroll = () => {
      document.documentElement.classList.add("prevent-scroll");
      document.body.classList.add("prevent-scroll");
    };

    const releaseScroll = () => {
      if (scrollReleased) return;
      scrollReleased = true;
      document.documentElement.classList.remove("prevent-scroll");
      document.body.classList.remove("prevent-scroll");
    };

    lockScroll();

    // GSAPを動的にインポート
    import("gsap")
      .then((gsapModule) => {
        const gsap = gsapModule.default;

        const container = containerRef.current;
        if (!container) {
          releaseScroll();
          return;
        }

        const WordElements = container.querySelectorAll(".rotating-word");
        const MyJourneyText = container.querySelector(".my-journey-text");
        const MyJourneyCurtain = container.querySelector(".my-journey-curtain");
        const MyJourneyBackground = container.querySelector(".my-journey-background");
        const invertTargets = container.querySelectorAll(".invert-on-dark");

        const backgroundDuration = 1.2;
        const typingSpeed = 0.08;
        let typingDuration = 0;

        if (MyJourneyText) {
          originalText = MyJourneyText.textContent ?? "";
          const characters = Array.from(originalText);
          typingDuration = characters.length * typingSpeed;

          const typingTimeline = gsap.timeline();
          animations.push(typingTimeline);

          MyJourneyText.textContent = "";
          MyJourneyText.classList.add("typing-active");

          let typingPosition = 0;
          characters.forEach((char) => {
            typingTimeline.call(
              () => {
                if (!MyJourneyText) return;
                MyJourneyText.textContent += char;
              },
              [],
              typingPosition
            );
            typingPosition += typingSpeed;
          });

          typingTimeline.call(
            () => {
              if (!MyJourneyText) return;
              MyJourneyText.classList.remove("typing-active");
              MyJourneyText.textContent = originalText;
            },
            [],
            typingDuration
          );
        }

        const postTypingBuffer = 0.4;
        const backgroundDelay = typingDuration + postTypingBuffer;

        if (MyJourneyCurtain) {
          const curtainTween = gsap.to(MyJourneyCurtain, {
            x: "0%",
            duration: backgroundDuration,
            ease: "power2.out",
            onComplete: () => {
              if (MyJourneyCurtain.parentNode) {
                MyJourneyCurtain.parentNode.removeChild(MyJourneyCurtain);
              }
            },
          });
          animations.push(curtainTween);
        }

        let backgroundTimeline: any = null;

        if (MyJourneyBackground) {
          invertTargets.forEach((el) => el.classList.add("blend-invert"));

          gsap.set(MyJourneyBackground, {
            transformOrigin: "50% 50%",
            scale: 2,
            autoAlpha: 1,
          });

          backgroundTimeline = gsap.timeline({ delay: backgroundDelay });
          animations.push(backgroundTimeline);

          backgroundTimeline.to(MyJourneyBackground, {
            scale: 0,
            duration: backgroundDuration,
            ease: "power4.in",
          });

          backgroundTimeline.add(() => {
            invertTargets.forEach((el) => el.classList.remove("blend-invert"));
            gsap.set(invertTargets, { color: "#ffffff", clearProps: "mixBlendMode" });
          });

          if (MyJourneyText) {
            backgroundTimeline.to(
              MyJourneyText,
              {
                duration: backgroundDuration,
                ease: "none",
              },
              "<"
            );
          }

          backgroundTimeline.eventCallback("onComplete", releaseScroll);
        } else if (MyJourneyText) {
          const textRevealTween = gsap.to(MyJourneyText, {
            duration: backgroundDuration,
            ease: "power2.inOut",
            delay: backgroundDelay,
          });
          animations.push(textRevealTween);
          const delayTween = gsap.delayedCall(backgroundDelay + backgroundDuration, releaseScroll);
          animations.push(delayTween);
        } else {
          const delayTween = gsap.delayedCall(backgroundDelay + backgroundDuration, releaseScroll);
          animations.push(delayTween);
        }

        if (MyJourneyText) {
          const textTween = gsap.to(MyJourneyText, {
            x: "-18rem",
            y: "1rem",
            scale: 0.3,
            duration: 1.2,
            ease: "power2.inOut",
            delay: backgroundDelay,
            onComplete: releaseScroll,
          });
          animations.push(textTween);
        }

        gsap.set(WordElements, {
          opacity: 0,
          y: 10,
          position: "absolute",
          left: 0,
          top: "-0rem",
        });

        // タイムライン作成
        const rotatingTimeline = gsap.timeline({
          repeat: -1,
          delay: backgroundDelay,
        });
        animations.push(rotatingTimeline);

        WordElements.forEach((element, index) => {
          const startTime = index * (fade * 2 + hold);

          // フェードイン
          rotatingTimeline.to(
            element,
            {
              opacity: 1,
              y: 0,
              duration: fade,
              ease: "power2.out",
            },
            startTime
          );

          // 表示維持
          rotatingTimeline.to(
            element,
            {
              duration: hold,
            },
            startTime + fade
          );

          // フェードアウト
          rotatingTimeline.to(
            element,
            {
              opacity: 0,
              y: -10,
              duration: fade,
              ease: "power2.in",
            },
            startTime + fade + hold
          );
        });
      })
      .catch(() => {
        releaseScroll();
      });

    return () => {
      animations.forEach((animation) => {
        if (animation && typeof animation.kill === "function") {
          animation.kill();
        }
      });
      releaseScroll();

      const textElement = containerRef.current?.querySelector(".my-journey-text");
      if (textElement) {
        textElement.classList.remove("typing-active");
        if (originalText.length) {
          textElement.textContent = originalText;
        }
      }
    };
  }, [words, hold, fade]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-baseline gap-3 text-balance ${className}`}
      style={{ fontFamily: "'Fugaz One', cursive" }}
    >
      <div
        className="my-journey-background pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10"
        style={{
          width: "180vw",
          height: "130vh",
          borderRadius: "60% / 50%",
        }}
      ></div>
      <span className="my-journey-text invert-on-dark text-9xl text-white justify-center select-none whitespace-nowrap z-11">My Journey...</span>
      
      <div className="flex">
        <span className="text-6xl">Technology</span>
        <span className="text-6xl opacity-70">×</span>
        <span className="text-6xl">Design</span>
        <span className="text-6xl opacity-70">×</span>

        <span className="relative inline-block min-w-[300px] align-baseline" style={{ height: "1.2em" }}>
          {words.map((word, i) => (
            <span
              key={`word-${i}`}
              className="rotating-word whitespace-nowrap text-6xl inline-block"
            >
              {word}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default MainPageAnimation;
