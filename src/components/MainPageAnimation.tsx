import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  words: string[];        // 巡回させるワード
  hold?: number;          // 1語の表示キープ時間（秒）
  fade?: number;          // フェード時間（秒）
  className?: string;     // ルートの追加クラス
};

const RotatingTagline: React.FC<Props> = ({
  words,
  hold = 1.4,
  fade = 0.4,
  className = "",
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // refs 配列に要素を集める
  const setWordRef = (el: HTMLSpanElement | null, i: number) => {
    if (!el) return;
    wordRefs.current[i] = el;
  };

  useEffect(() => {
    if (!wrapRef.current || wordRefs.current.length === 0) return;

    // 初期状態：全て非表示
    gsap.set(wordRefs.current, { autoAlpha: 0, y: 12 });

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });

    wordRefs.current.forEach((el) => {
      // フェードイン
      tl.to(el, { autoAlpha: 1, y: 0, duration: fade });
      // 表示維持
      tl.to(el, { duration: hold });
      // フェードアウト（上へ）
      tl.to(el, { autoAlpha: 0, y: -12, duration: fade }, "+=0");
      // 次の単語までの間隔（必要なら調整）
      tl.to({}, { duration: 0.1 });
    });

    tlRef.current = tl;

    // ホバーで一時停止
    const el = wrapRef.current;
    const onEnter = () => tl.pause();
    const onLeave = () => tl.play();
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      tl.kill();
    };
  }, [words, hold, fade]);

  return (
    <div
      ref={wrapRef}
      className={`flex items-baseline gap-2 text-balance ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-xl md:text-2xl font-medium">Technology</span>
      <span className="text-xl md:text-2xl opacity-70">×</span>
      <span className="text-xl md:text-2xl font-medium">AI</span>
      <span className="text-xl md:text-2xl opacity-70">×</span>

      {/* 単語表示枠：オーバーフロー隠す */}
      <span className="relative inline-flex h-[1.6em] overflow-hidden">
        {/* 重ね描きで切替 */}
        {words.map((w, i) => (
          <span
            key={w + i}
            ref={(el) => setWordRef(el, i)}
            className="absolute left-0 top-0 whitespace-nowrap font-semibold text-xl md:text-2xl"
            style={{ willChange: "transform, opacity" }}
          >
            {w}
          </span>
        ))}
      </span>
    </div>
  );
};

export default RotatingTagline;
