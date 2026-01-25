import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

export default function SmoothScroll() {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useGSAP(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
    });

    return () => {
      smootherRef.current?.kill();
    };
  });

  // SPAナビゲーション時にScrollSmootherをリフレッシュ
  useEffect(() => {
    const handleNavigation = () => {
      if (smootherRef.current) {
        // スクロール位置をトップにリセット
        smootherRef.current.scrollTo(0, false);
        // ScrollTriggerをリフレッシュ
        ScrollTrigger.refresh();
      }
    };

    // カスタムイベントでナビゲーションを検知
    window.addEventListener("spa-navigation", handleNavigation);
    return () => window.removeEventListener("spa-navigation", handleNavigation);
  }, []);

  return null;
}
