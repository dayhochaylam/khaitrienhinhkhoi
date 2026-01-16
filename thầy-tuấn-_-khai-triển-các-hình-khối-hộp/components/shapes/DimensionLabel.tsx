
import React from 'react';
import { Html } from '@react-three/drei';

interface DimensionLabelProps {
  position: [number, number, number];
  text: string;
  visible?: boolean;
}

export const DimensionLabel: React.FC<DimensionLabelProps> = ({ position, text, visible = true }) => {
  if (!visible) return null;

  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className="px-1.5 py-0.5 bg-white/90 backdrop-blur-[2px] border border-gray-300 rounded text-[10px] font-bold text-gray-900 shadow-sm whitespace-nowrap select-none pointer-events-none flex items-center justify-center transform transition-transform hover:scale-110">
        {text}
      </div>
    </Html>
  );
};
