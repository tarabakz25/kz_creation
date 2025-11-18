import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Works: React.FC = () => {
  const contantRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Works Page</h1>
    </div>
  );
};

export default Works;
