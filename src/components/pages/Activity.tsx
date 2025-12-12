"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface ActivityItem {
  id: string;
  date: string;
  period?: string;
  title: string;
  description?: string;
  tags?: string[];
}

type ActivityProps = {
  items: ActivityItem[];
};

export default function Activity({ items }: ActivityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const scrollPositionRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartScrollRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderedItems = itemsRef.current;
    const isMobile = window.innerWidth < 768;
    const itemHeight = isMobile ? 160 : 200; // モバイルでは少し小さく
    const baseOffset = container.clientHeight / 2 - itemHeight / 2;
    const maxScroll = Math.max(0, (renderedItems.length - 1) * itemHeight);

    // 初期位置の設定
    renderedItems.forEach((item, index) => {
      gsap.set(item, {
        y: index * itemHeight + baseOffset,
        scale: 0.85,
        opacity: 0.4,
      });
    });

    // アイテムの位置とスケールを更新する関数
    const updateItems = () => {
      const centerY = container.clientHeight / 2;

      renderedItems.forEach((item, index) => {
        const itemY = index * itemHeight - scrollPositionRef.current + baseOffset;
        const distanceFromCenter = Math.abs(centerY - (itemY + itemHeight / 2));
        const maxDistance = container.clientHeight / 2;

        // 中央に近いほど大きく、遠いほど小さく
        const scale = Math.max(0.85, 1 - (distanceFromCenter / maxDistance) * 0.15);
        const opacity = Math.max(0.4, 1 - (distanceFromCenter / maxDistance) * 0.6);

        gsap.to(item, {
          y: itemY,
          scale,
          opacity,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    // ホイールイベント
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollPositionRef.current = Math.max(
        0,
        Math.min(maxScroll, scrollPositionRef.current + e.deltaY * 0.5)
      );
      updateItems();
    };

    // タッチイベント
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
        touchStartScrollRef.current = scrollPositionRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null || e.touches.length !== 1) return;
      
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      
      scrollPositionRef.current = Math.max(
        0,
        Math.min(maxScroll, touchStartScrollRef.current + deltaY * 1.2)
      );
      updateItems();
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    updateItems();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [items.length]);

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl h-screen p-4 overflow-hidden select-none relative">
      <div className="relative h-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="absolute left-0 right-0 will-change-transform"
          >
            <div className="mb-8 p-4 sm:p-6 main-fg transform-gpu" style={{ minHeight: '140px', height: 'auto' }}>
              <div className="text-xs sm:text-sm mb-1 font-futura">
                {item.date} {item.period && ` - ${item.period}`}
              </div>
              <div className="text-xl sm:text-2xl font-semibold mb-2 font-eurostile">{item.title}</div>
              {item.description && (
                <div className="mb-2">{item.description}</div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={`${item.id}-tag-${tagIndex}`}
                      className="text-xs px-2 py-1 font-futura"
                    >
                      # {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
