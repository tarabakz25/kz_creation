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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderedItems = itemsRef.current;
    const itemHeight = 200; // 各アイテムの高さ
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

    container.addEventListener("wheel", handleWheel, { passive: false });

    updateItems();

    return () => {
      container.removeEventListener("wheel", handleWheel);
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
            <div className="mb-8 p-6 main-fg transform-gpu" style={{ height: '180px' }}>
              <div className="text-sm mb-1 font-futura">
                {item.date} {item.period && ` - ${item.period}`}
              </div>
              <div className="text-2xl font-semibold mb-2 font-eurostile">{item.title}</div>
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
