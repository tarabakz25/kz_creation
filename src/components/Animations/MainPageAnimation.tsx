import React, { useEffect, useRef } from "react";
import "@fontsource/fugaz-one";

type Props = {
  words: string[];
  hold?: number;
  fade?: number;
  className?: string;
};

const RotatingTagline: React.FC<Props> = ({
  words,
  hold = 1.4,
  fade = 0.4,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAPを動的にインポート
    import("gsap").then((gsapModule) => {
      const gsap = gsapModule.default;
      
      if (!containerRef.current) return;

      const wordElements = containerRef.current.querySelectorAll(".rotating-word");
      
      if (wordElements.length === 0) return;

      // 初期状態：全て非表示
      gsap.set(wordElements, { 
        opacity: 0, 
        y: 10,
        position: "absolute",
        left: 0,
        top: "0.3rem",
      });

      // タイムライン作成
      const tl = gsap.timeline({ 
        repeat: -1
      });

      wordElements.forEach((element, index) => {
        const startTime = index * (fade * 2 + hold);
         
        // フェードイン
        tl.to(element, { 
          opacity: 1, 
          y: 0,
          duration: fade,
          ease: "power2.out"
        }, startTime);
        
        // 表示維持
        tl.to(element, { 
          duration: hold 
        }, startTime + fade);
        
        // フェードアウト
        tl.to(element, { 
          opacity: 0, 
          y: -10,
          duration: fade,
          ease: "power2.in"
        }, startTime + fade + hold);
      });
    });
  }, [words, hold, fade]);

  return (
    <div
      ref={containerRef}
      className={`flex items-baseline gap-3 text-balance ${className}`}
      style={{ fontFamily: "'Fugaz One', cursive" }}
    >
      <span className="text-5xl">Technology</span>
      <span className="text-5xl opacity-70">×</span>
      <span className="text-5xl">AI</span>
      <span className="text-5xl opacity-70">×</span>

      <span className="relative inline-block min-w-[300px] align-baseline" style={{ height: "1.2em" }}>
        {words.map((word, i) => (
          <span
            key={`word-${i}`}
            className="rotating-word whitespace-nowrap text-5xl inline-block"
          >
            {word}
          </span>
        ))}
      </span>
    </div>
  );
};

export default RotatingTagline;
