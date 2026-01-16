
import React from 'react';
import { UnfoldPattern, LabelStyle } from '../../types';
import { FoldableRectangularPrism } from './FoldableRectangularPrism';

interface FoldableCubeProps {
  progress: number;
  showWireframe: boolean;
  showLabels: boolean;
  labelStyle?: LabelStyle;
  labelColor?: string; // New Prop for Label Text Color
  showVertices?: boolean;
  showDimensions?: boolean; // New Prop
  size?: number;
  faceColors: string[]; // Updated prop
  baseHue: number; // Ignored/Deprecated but kept for type compatibility if needed upstream
  faceHues?: number[]; // Deprecated
  opacity?: number;
  pattern?: UnfoldPattern;
}

/**
 * FoldableCube is now a specialized wrapper around FoldableRectangularPrism.
 * It forces all dimensions (Length, Width, Height) to be equal to `size`.
 * This allows the Cube to inherit all 11 Net implementations automatically.
 */
export const FoldableCube: React.FC<FoldableCubeProps> = ({ 
  progress, 
  showWireframe, 
  showLabels, 
  labelStyle,
  labelColor = 'white', // Default to white
  showVertices,
  showDimensions = false,
  size = 2,
  faceColors,
  opacity = 0.9,
  pattern = UnfoldPattern.NET_1
}) => {
  return (
    <FoldableRectangularPrism
      progress={progress}
      showWireframe={showWireframe}
      showLabels={showLabels}
      labelStyle={labelStyle}
      labelColor={labelColor}
      showVertices={showVertices}
      showDimensions={showDimensions}
      dimensions={{ length: size, width: size, height: size }}
      faceColors={faceColors}
      baseHue={0}
      faceHues={[]}
      opacity={opacity}
      pattern={pattern}
    />
  );
};
