
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Viewer3D } from './components/Viewer3D';
import { AppState, ShapeType, UnfoldPattern, AppTheme } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    shape: ShapeType.RECTANGULAR_PRISM,
    unfoldPattern: UnfoldPattern.NET_1,
    foldProgress: 0.5, 
    showWireframe: true,
    showLabels: true,
    labelStyle: 'NUMBERS', // Default Label Style
    showGrid: true,
    showVertices: true, // Enabled by default
    showDimensions: false, // Default to hidden
    autoRotate: false, 
    isPlaying: false,
    animationDirection: 1, // Default to Unfold
    dimensions: {
      length: 3,
      width: 2,
      height: 1.5
    },
    // Defaults: Red, Green, Blue, Yellow, Purple, Cyan (Tailwind-ish Hex)
    faceColors: ['#EF4444', '#22C55E', '#3B82F6', '#EAB308', '#A855F7', '#06B6D4'], 
    opacity: 0.9,
    rotationY: 0,
    theme: AppTheme.GALAXY, // Default theme
    activeMathMode: 'NONE',
    screenshotTrigger: 0,
    resetCameraTrigger: 0
  });

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (state.isPlaying) {
        setState(prev => {
          const SPEED = 0.01;
          let nextProgress = prev.foldProgress + (SPEED * prev.animationDirection);
          
          // Check limits and stop animation if reached
          if (prev.animationDirection === 1 && nextProgress >= 1) {
            return { ...prev, foldProgress: 1, isPlaying: false };
          } else if (prev.animationDirection === -1 && nextProgress <= 0) {
            return { ...prev, foldProgress: 0, isPlaying: false };
          }

          return { ...prev, foldProgress: nextProgress };
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [state.isPlaying]);

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
      <Sidebar state={state} setState={setState} />
      <main className="flex-1 h-full relative">
        <Viewer3D state={state} />
      </main>
    </div>
  );
};

export default App;
