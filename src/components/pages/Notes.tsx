"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

type Article = {
  title: string;
  url: string;
  publishedAt?: string;
};

const ITEM_HEIGHT = 200;

export default function Notes() {
  const [items, setItems] = useState<Article[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const response = await fetch("/api/articles.json", { credentials: "same-origin" });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
          if (!aborted) {
            setItems([]);
            setErr(errorData.error || `Failed to load articles (${response.status})`);
          }
          return;
        }

        const payload = await response.json();

        if (aborted) return;
        if (payload?.items && Array.isArray(payload.items)) {
          setItems(payload.items);
          setErr(null);
        } else {
          setItems([]);
          setErr(payload?.error || "記事データが見つかりませんでした");
        }
      } catch (e) {
        if (!aborted) {
          setItems([]);
          setErr(e instanceof Error ? e.message : "An error occurred while fetching articles");
        }
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const elements = itemRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

    if (!container || elements.length === 0) {
      return;
    }

    scrollPositionRef.current = 0;

    const itemHeight = ITEM_HEIGHT;
    const baseOffset = container.clientHeight / 2 - itemHeight / 2;
    const maxScroll = Math.max((elements.length - 1) * itemHeight, 0);

    elements.forEach((item, index) => {
      gsap.set(item, {
        y: index * itemHeight + baseOffset,
        scale: 0.85,
        opacity: 0.4,
      });
    });

    const updateItems = () => {
      const centerY = container.clientHeight / 2;

      elements.forEach((item, index) => {
        const targetY = index * itemHeight - scrollPositionRef.current + baseOffset;
        const distanceFromCenter = Math.abs(centerY - (targetY + itemHeight / 2));
        const maxDistance = container.clientHeight / 2;

        const scale = Math.max(0.85, 1 - (distanceFromCenter / maxDistance) * 0.15);
        const opacity = Math.max(0.4, 1 - (distanceFromCenter / maxDistance) * 0.6);

        gsap.to(item, {
          y: targetY,
          scale,
          opacity,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      scrollPositionRef.current = Math.max(
        0,
        Math.min(maxScroll, scrollPositionRef.current + event.deltaY * 0.5),
      );
      updateItems();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    updateItems();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      gsap.killTweensOf(elements);
    };
  }, [items]);

  const formattedStatus = (() => {
    if (err) {
      return (
        <div className="px-4 py-2 bg-red-500/10 border border-red-500/40 rounded text-sm text-red-200 backdrop-blur">
          {err}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-white/70 backdrop-blur-sm border border-white/10 rounded">
          Loading...
        </div>
      );
    }

    return null;
  })();

  itemRefs.current = itemRefs.current.slice(0, items.length);

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl h-screen p-4 overflow-hidden select-none relative">
      {formattedStatus && (
        <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 z-10">
          {formattedStatus}
        </div>
      )}
      <div className="relative h-full">
        {items.map((item, index) => {
          const publishedDate =
            item.publishedAt && !Number.isNaN(new Date(item.publishedAt).getTime())
              ? new Date(item.publishedAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : null;

          return (
            <div
              key={`${item.url}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="absolute left-0 right-0 will-change-transform"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 block h-[180px] p-6 main-fg transform-gpu"
              >
                {publishedDate && (
                  <div className="text-sm mb-1 font-futura">
                    {publishedDate}
                  </div>
                )}
                <div className="flex items-start gap-2 text-2xl font-semibold mb-4 font-eurostile leading-tight">
                  <span className="flex-1 break-words">{item.title}</span>
                  <FaArrowUpRightFromSquare className="text-base shrink-0 mt-1 opacity-70" />
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
