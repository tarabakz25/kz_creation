import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {
  UserName: string;
  cellSize?: number;
  cellGap?: number;
  heightScale?: number;
  maxClamp?: number;
}

type DayCell = { x: number; y: number; date: string; count: number; color: string; };

const FetchData = async (UserName: string) => {
  const Response = await fetch(`/api/github-contrib?user=${UserName}`);
  if (!Response.ok) {
    throw new Error("Failed to fetch GitHub contributions");
  }

  return (await Response.json()) as {
    total: number;
    width: number;
    height: number;
    days: DayCell[];
  };
}

export default function GithubContrib3D({
  UserName,
  cellsize = 10,
  cellGap = 4,
  heightScale = 0.4,
  maxClamp = 20,
}: Props) {
  const ContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    if (!ContentRef.current) return;

    const Content = ContentRef.current;
    
    const Scene = new THREE.Scene();
    Scene.background = new THREE.Color(0x202020);

    const Renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    Renderer.setSize(Content.clientWidth, Content.clientHeight);
    Renderer.setPixelRatio(window.devicePixelRatio);
    Content.appendChild(Renderer.domElement);

    const Camera = new THREE.PerspectiveCamera(45, Content.clientWidth / Content.clientHeight, 0.1, 1000);
    Camera.position.set(0, 100, 150);

    const Controls = new OrbitControls(Camera, Renderer.domElement);
    Controls.enableDamping = true;
    Controls.dampingFactor = 0.05;
    Controls.minDistance = 50;
    Controls.maxDistance = 300;

    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
    Scene.add(AmbientLight);

    const DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    DirectionalLight.position.set(100, 100, 100);
    Scene.add(DirectionalLight);

    const createCell = (x: number, y: number, height: number, color: string) => {
      const Geometry = new THREE.BoxGeometry(cellsize, height, cellsize);
      const Material = new THREE.MeshStandardMaterial({ color });
      const Cell = new THREE.Mesh(Geometry, Material);
      Cell.position.set(
        x * (cellsize + cellGap),
        height / 2,
        -y * (cellsize + cellGap)
      );
      return Cell;
    }

    let AnimationId: number;

    const animate = () => {
      Controls.update();
      Renderer.render(Scene, Camera);
      AnimationId = requestAnimationFrame(animate);
    };
    animate();

    FetchData(UserName).then(data => {
      if (!mounted) return;
      const OffsetX = -((data.width * (cellsize + cellGap)) / 2) + (cellsize + cellGap) / 2;
      const OffsetY = ((data.height * (cellsize + cellGap)) / 2) - (cellsize + cellGap) / 2;

      data.days.forEach(day => {
        const clampedCount = Math.min(day.count, maxClamp);
        const height = clampedCount * heightScale + 1; // Minimum height of 1
        const cell = createCell(day.x + OffsetX / (cellsize + cellGap), day.y - OffsetY / (cellsize + cellGap), height, day.color);
        Scene.add(cell);
      });
    }).catch(err => {
      console.error(err);
    });

    const handleResize = () => {
      if (!ContentRef.current) return;
      Camera.aspect = ContentRef.current.clientWidth / ContentRef.current.clientHeight;
      Camera.updateProjectionMatrix();
      Renderer.setSize(ContentRef.current.clientWidth, ContentRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(AnimationId);
      Controls.dispose();
      Renderer.dispose();
      Scene.clear();
      if (ContentRef.current) {
        ContentRef.current.removeChild(Renderer.domElement);
      }
    };
  }, [UserName, cellsize, cellGap, heightScale, maxClamp]);

  return <div ref={ContentRef} className="w-full h-full" />;
};
