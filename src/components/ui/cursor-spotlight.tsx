import { useEffect, useRef, useState } from 'react';

interface CursorSpotlightProps {
  size?: number;
  opacity?: number;
  color?: string;
}

export default function CursorSpotlight({
  size = 600,
  opacity = 0.2,
  color = '#ffffff',
}: CursorSpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // タッチデバイスの検出
    const touchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0;

    setIsTouchDevice(touchDevice);

    if (touchDevice) {
      return;
    }

    const updateSpotlight = () => {
      if (!spotlightRef.current) return;

      // スムーズな追従効果（イージング）
      const dx = mousePositionRef.current.x - currentPositionRef.current.x;
      const dy = mousePositionRef.current.y - currentPositionRef.current.y;
      currentPositionRef.current.x += dx * 0.1;
      currentPositionRef.current.y += dy * 0.1;

      const { x, y } = currentPositionRef.current;

      // より洗練されたスポットライト効果
      spotlightRef.current.style.background = `
        radial-gradient(
          circle ${size}px at ${x}px ${y}px,
          transparent 0%,
          transparent 35%,
          rgba(0, 0, 0, ${opacity * 0.5}) 50%,
          rgba(0, 0, 0, ${opacity}) 70%,
          rgba(0, 0, 0, ${opacity * 1.3}) 100%
        )
      `;
      rafIdRef.current = requestAnimationFrame(updateSpotlight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      if (!isHovering) {
        setIsHovering(true);
        rafIdRef.current = requestAnimationFrame(updateSpotlight);
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '1';
      }
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateSpotlight);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [size, opacity, color, isHovering]);

  // タッチデバイスでは表示しない
  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-500"
      style={{
        mixBlendMode: 'difference',
        opacity: 0,
        willChange: 'background',
      }}
      aria-hidden="true"
    />
  );
}
