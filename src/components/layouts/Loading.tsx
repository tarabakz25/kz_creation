import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type Props = {
  gridSize?: number;
  className?: string;
  onComplete?: () => void;
  duration?: number;
};

const Loading: React.FC<Props> = ({ 
  gridSize = 40, 
  className = '', 
  onComplete,
  duration = 2000 
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cells, setCells] = useState<Array<{ id: number; row: number; col: number }>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);
      
      const newCells: Array<{ id: number; row: number; col: number }> = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          newCells.push({ id: row * cols + col, row, col });
        }
      }
      
      setCells(newCells);
    };

    calculateGrid();

    const handleResize = () => {
      calculateGrid();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridSize]);

  useEffect(() => {
    if (cells.length === 0 || !containerRef.current) return;

    // Cleanup previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const cellElements = containerRef.current.querySelectorAll('.loading-cell');
    if (cellElements.length === 0) return;

    // Create timeline
    const tl = gsap.timeline();

    // Set initial state - all cells invisible
    gsap.set(cellElements, { 
      opacity: 0,
      scale: 0.8,
    });

    // Animate cells in sequence
    const staggerDelay = 0.02; // Delay between each cell animation
    const cellsPerWave = Math.max(1, Math.floor(cells.length / 50)); // Animate in waves
    
    cellElements.forEach((cell, index) => {
      const delay = (index % cellsPerWave) * staggerDelay + Math.floor(index / cellsPerWave) * 0.1;
      
      tl.to(cell, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, delay);
    });

    // After all cells are visible, create pulsing effect
    const pulseDelay = tl.duration() + 0.5;
    tl.to(cellElements, {
      opacity: 0.3,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.inOut',
      repeat: 1,
      yoyo: true,
    }, pulseDelay);

    // Fade out all cells
    const fadeOutDelay = pulseDelay + 1.6;
    tl.to(cellElements, {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.in',
      stagger: {
        amount: 0.8,
        from: 'random',
      },
    }, fadeOutDelay);

    // Fade out wrapper
    tl.to(wrapperRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, fadeOutDelay + 0.8);

    // Hide wrapper completely and call onComplete
    tl.set(wrapperRef.current, {
      display: 'none',
    }, fadeOutDelay + 1.3);

    tl.call(() => {
      onComplete?.();
    }, [], fadeOutDelay + 1.3);

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [cells, onComplete]);

  return (
    <div 
      ref={wrapperRef}
      className={`fixed inset-0 z-50 bg-black ${className}`}
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        ref={containerRef}
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${gridSize}px)`,
          gridAutoRows: `${gridSize}px`,
        }}
      >
        {cells.map((cell) => (
          <div
            key={cell.id}
            className="loading-cell bg-white"
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;