import { useState, useLayoutEffect, use} from "react";
import { Dithering } from "@paper-design/shaders-react";

export default function Shader() {
  const [size, setSize] = useState([0, 0]);
  
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    }
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => {
      window.removeEventListener('resize', updateSize);
    }
  }, []);
  
  return (
    <Dithering
      width={size[0]}
      height={size[1]}
      colorBack="#000000"
      colorFront="#60949f"
      shape="warp"
      type="4x4"
      size={2.5}
      speed={0.16}
    />
  );
}
