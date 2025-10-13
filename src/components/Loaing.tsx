import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Loading() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {

    }
  })
}
