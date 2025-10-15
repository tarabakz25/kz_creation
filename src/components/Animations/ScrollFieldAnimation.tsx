import React, { useEffect, useRef } from "react";

const ScrollFieldAnimation: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger")
    ]).then(([gsapModule, ScrollTriggerModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;
      
      gsap.registerPlugin(ScrollTrigger);

      if (!circleRef.current) return;

      gsap.set(circleRef.current, {
        scale: 0,
        x: "-50%",
        y: "200%",
      });

      // スムーススクロールとの互換性のため少し遅延
      const timer = setTimeout(() => {
        if (!circleRef.current) return;

        // スクロールに応じて円を拡大
        gsap.to(circleRef.current, {
          scale: 25, 
          scrollTrigger: {
            trigger: circleRef.current,
            start: "top 100%", 
            end: "top 50%", 
            scrub: 1,
            markers: false, // デバッグ時はtrueに
          }
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    });
  }, []);

  return (
    <></>
  );
};
        
export default ScrollFieldAnimation;
