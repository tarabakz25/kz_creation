import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingProps {
  onComplete?: () => void;
  duration?: number;
}

const Loading: React.FC<LoadingProps> = ({ onComplete, duration = 3000 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const triangleRefs = useRef<HTMLDivElement[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      // 初期状態
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(textRef.current, { opacity: 0, y: 30 });
      gsap.set(gridRef.current?.children || [], { 
        opacity: 0, 
        scale: 0.8,
        rotation: 0 
      });
      gsap.set(lineRefs.current, { 
        scaleX: 0,
        transformOrigin: 'left center'
      });
      gsap.set(triangleRefs.current, { 
        opacity: 0,
        rotation: -180,
        scale: 0
      });

      // メインアニメーション
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // フェードイン
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.6
      });

      // テキストアニメーション
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.3');

      // グリッドアニメーション（順次表示）
      tl.to(gridRef.current?.children || [], {
        opacity: 1,
        scale: 1,
        rotation: 360,
        duration: 0.4,
        stagger: {
          amount: 1.2,
          grid: [8, 8],
          from: 'center'
        }
      }, '-=0.4');

      // ラインアニメーション
      tl.to(lineRefs.current, {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.inOut'
      }, '-=0.6');

      // トライアングルアニメーション
      tl.to(triangleRefs.current, {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)'
      }, '-=0.4');

      // ローディング完了後のフェードアウト
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: () => {
          setIsComplete(true);
          onComplete?.();
        }
      }, `+=${duration / 1000 - 2}`);

    }, containerRef);

    return () => ctx.revert();
  }, [duration, onComplete]);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden"
    >
      {/* 背景グリッド */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-2 p-4 opacity-30"
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="border border-cyan-400/20 bg-cyan-500/5 rounded-sm"
          />
        ))}
      </div>

      {/* アニメーションライン */}
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) lineRefs.current[i] = el;
            }}
            className="h-[2px] w-full max-w-2xl bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ transform: 'scaleX(0)' }}
          />
        ))}
      </div>

      {/* トライアングル装飾 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          const radius = 120;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          return (
            <div
              key={i}
              ref={(el) => {
                if (el) triangleRefs.current[i] = el;
              }}
              className="absolute w-0 h-0"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: `12px solid rgba(34, 211, 238, ${0.6 + (i % 3) * 0.1})`,
              }}
            />
          );
        })}
      </div>

      {/* メインテキスト */}
      <div
        ref={textRef}
        className="relative z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            KZ
          </span>
          <span className="text-white"> CREATION</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* エッジ装飾 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
      <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
    </div>
  );
};

export default Loading;