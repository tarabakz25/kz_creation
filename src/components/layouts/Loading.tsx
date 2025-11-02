import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import kzCreationSvg from '../../assets/images/kz_creation.svg?url';

type Props = {
  gridSize?: number;
  className?: string;
  onComplete?: () => void;
};

const Loading: React.FC<Props> = ({ gridSize = 40, className = '', onComplete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLImageElement>(null);
  const cellsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || !gridRef.current) return;

    const container = containerRef.current;
    const cols = Math.ceil(container.offsetWidth / gridSize);
    const rows = Math.ceil(container.offsetHeight / gridSize);
    const totalCells = cols * rows;

    // グリッドセルを生成
    const cells: HTMLDivElement[] = [];
    gridRef.current.innerHTML = '';

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.style.width = `${gridSize}px`;
      cell.style.height = `${gridSize}px`;
      cell.style.backgroundColor = '#252525';
      cell.style.border = 'none';
      cell.style.margin = '0';
      cell.style.padding = '0';
      gridRef.current.appendChild(cell);
      cells.push(cell);
    }

    cellsRef.current = cells;

    // 各セルの中心からの距離を計算
    const centerX = cols / 2;
    const centerY = rows / 2;
    const cellDistances: Array<{ cell: HTMLDivElement; distance: number; index: number }> = [];

    cells.forEach((cell, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const distance = Math.sqrt(
        Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
      );
      cellDistances.push({ cell, distance, index });
    });

    // 距離でソート（外側から内側へ）
    cellDistances.sort((a, b) => b.distance - a.distance);

    // 距離グループに分ける（同じ距離のセルをグループ化）
    const distanceGroups: HTMLDivElement[][] = [];
    let currentGroup: HTMLDivElement[] = [];
    let currentDistance = cellDistances[0].distance;

    cellDistances.forEach(({ cell, distance }) => {
      if (Math.abs(distance - currentDistance) < 0.1) {
        currentGroup.push(cell);
      } else {
        if (currentGroup.length > 0) {
          distanceGroups.push([...currentGroup]);
        }
        currentGroup = [cell];
        currentDistance = distance;
      }
    });
    if (currentGroup.length > 0) {
      distanceGroups.push(currentGroup);
    }

    // 各グループ内でランダムにシャッフル
    distanceGroups.forEach((group) => {
      for (let i = group.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [group[i], group[j]] = [group[j], group[i]];
      }
    });

    // GSAPアニメーション
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    // 各グループを順番にアニメーション（外側から内側へ）
    distanceGroups.forEach((group, groupIndex) => {
      group.forEach((cell, cellIndex) => {
        const delay = groupIndex * 0.02 + (cellIndex / group.length) * 0.01;
        tl.to(
          cell,
          {
            backgroundColor: '#FFFFFF',
            duration: 0.3,
            ease: 'power2.out',
          },
          delay
        );
      });
    });

    // SVGのアニメーション（グリッドの進行に合わせて色を変更）
    if (svgRef.current) {
      const totalDuration = distanceGroups.length * 0.02 + 0.3;
      tl.to(
        svgRef.current,
        {
          filter: 'brightness(0) invert(1)',
          duration: totalDuration * 0.8,
          ease: 'power2.inOut',
        },
        0
      );
    }
  }, [gridSize, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#252525] ${className}`}
    >
      {/* グリッド */}
      <div
        ref={gridRef}
        className="absolute inset-0 flex flex-wrap"
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* 中央のSVG */}
      <img
        ref={svgRef}
        src={kzCreationSvg}
        alt="Kz Creation"
        className="relative z-10 max-w-[80%] max-h-[80%] w-auto h-auto"
        style={{
          filter: 'brightness(0)',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
};

export default Loading;
