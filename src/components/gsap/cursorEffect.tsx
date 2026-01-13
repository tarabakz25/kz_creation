import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Cell {
  id: number;
  x: number;
  y: number;
}

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const cellSize = 20; // Size of each grid cell in pixels (increased for performance)

  // Initialize Grid
  useEffect(() => {
    const initGrid = () => {
      // Use window dimensions directly to ensure full coverage
      const width = window.innerWidth;
      const height = window.innerHeight;

      const newCols = Math.ceil(width / cellSize);
      const newRows = Math.ceil(height / cellSize);

      setCols(newCols);
      setRows(newRows);

      const newCells: Cell[] = [];
      for (let y = 0; y < newRows; y++) {
        for (let x = 0; x < newCols; x++) {
          newCells.push({
            id: y * newCols + x,
            x,
            y,
          });
        }
      }
      setCells(newCells);
    };

    initGrid();
    window.addEventListener("resize", initGrid);
    return () => window.removeEventListener("resize", initGrid);
  }, []);

  // Handle Mouse Move via Global Listener
  useEffect(() => {
    // Throttle mousemove for performance
    let rafId: number | null = null;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return; // Skip if already processing

      rafId = requestAnimationFrame(() => {
        rafId = null;

        // Calculate grid position based on client coordinates
        const col = Math.floor(e.clientX / cellSize);
        const row = Math.floor(e.clientY / cellSize);

        // Randomize radius slightly for "glitch" feel
        const radius = Math.floor(Math.random() * 2) + 1;

        const cellsToUpdate = new Set<number>();

        for (let y = row - radius; y <= row + radius; y++) {
          for (let x = col - radius; x <= col + radius; x++) {
            if (x >= 0 && x < cols && y >= 0 && y < rows) {
              // Random chance to skip some cells for "noise"
              if (Math.random() > 0.2) {
                cellsToUpdate.add(y * cols + x);
              }
            }
          }
        }

        // Direct DOM manipulation for performance
        cellsToUpdate.forEach((index) => {
          const cellEl = document.getElementById(`cell-${index}`);
          if (cellEl) {
            // Kill existing tweens to prevent conflict
            gsap.killTweensOf(cellEl);

            // Immediate switch to White (Active)
            gsap.set(cellEl, {
              backgroundColor: "#ffffff",
              zIndex: 10,
            });

            gsap.to(cellEl, {
              backgroundColor: "transparent", // Reveal background
              zIndex: 1,
              duration: 0, // Immediate switch back
              delay: 0.1 + Math.random() * 0.4, // Random delay between 0.1s and 0.5s
              ease: "none",
            });
          }
        });
      });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [cols, rows]); // Re-bind when grid dimensions change

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
    >
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {cells.map((cell) => (
          <div
            key={cell.id}
            id={`cell-${cell.id}`}
            className="w-full h-full bg-transparent" // Transparent by default, no border
          />
        ))}
      </div>
    </div>
  );
}
