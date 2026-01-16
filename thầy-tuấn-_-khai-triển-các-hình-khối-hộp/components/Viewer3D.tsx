
import React, { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { FoldableCube } from './shapes/FoldableCube';
import { FoldableRectangularPrism } from './shapes/FoldableRectangularPrism';
import { ShapeType, AppState, AppTheme } from '../types';

interface Viewer3DProps {
  state: AppState;
}

/**
 * Internal component to handle side-effects that require access to the Three.js context (gl, camera, controls)
 */
const SceneEffects: React.FC<{ state: AppState }> = ({ state }) => {
  const { gl, controls } = useThree();

  // Handle Screenshot
  useEffect(() => {
    if (state.screenshotTrigger > 0) {
      // Force a render before capture to ensure everything is up to date (optional but good practice)
      gl.render(useThree.getState().scene, useThree.getState().camera);
      
      const dataURL = gl.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.setAttribute('download', `mo-phong-hinh-hop_${timestamp}.png`);
      link.setAttribute('href', dataURL);
      link.click();
    }
  }, [state.screenshotTrigger, gl]);

  // Handle Camera Reset
  useEffect(() => {
    if (state.resetCameraTrigger > 0) {
      if (controls) {
        // @ts-ignore - OrbitControls type definition might be missing reset() in some versions, but it exists
        controls.reset();
      }
    }
  }, [state.resetCameraTrigger, controls]);

  return null;
};

export const Viewer3D: React.FC<Viewer3DProps> = ({ state }) => {
  
  // Theme configuration map
  const themeConfig = useMemo(() => {
    switch (state.theme) {
      case AppTheme.GRAPH_PAPER: // 📝 Giấy Ô Ly
        return {
          bg: '#fdf6e3', // Paper Cream
          gridSection: '#93a1a1', 
          gridCell: '#ccdbe6',    // Blue ink style
          textTitle: 'text-gray-900',
          textSub: 'text-gray-600',
          showGrid: true,
          labelColor: 'black', // Contrast for light background feel (though faces are colored)
          fogColor: '#fdf6e3',
          fogDensity: 0.02
        };
      case AppTheme.CYBERPUNK: // ✨ Cyberpunk
        return {
          bg: '#0b0c15', // Dark Violet/Black
          gridSection: '#ff00cc', // Magenta Neon
          gridCell: '#00ffcc',    // Cyan Neon
          textTitle: 'text-white',
          textSub: 'text-cyan-400',
          showGrid: true,
          labelColor: 'white',
          fogColor: '#0b0c15',
          fogDensity: 0.05
        };
      case AppTheme.CHALKBOARD: // 🏫 Bảng Phấn
        return {
          bg: '#2b452e', // Dark Green
          gridSection: '#ffffff', // Chalk White
          gridCell: 'rgba(255,255,255,0.3)', // Faint Chalk
          textTitle: 'text-white',
          textSub: 'text-gray-300',
          showGrid: true,
          labelColor: 'white',
          fogColor: '#2b452e',
          fogDensity: 0.03
        };
      case AppTheme.MINECRAFT: // 🧱 Minecraft / Sky
        return {
          bg: '#87CEEB', // Sky Blue
          gridSection: '#5c4033', // Brown/Earth
          gridCell: '#4C9141',    // Grass Green
          textTitle: 'text-gray-900',
          textSub: 'text-gray-700',
          showGrid: true,
          labelColor: 'white', // High contrast
          fogColor: '#87CEEB',
          fogDensity: 0.015
        };
      case AppTheme.WOODEN_DESK: // 🪵 Mặt Bàn Gỗ
        return {
          bg: '#5d4037', // Dark Wood
          gridSection: '#3e2723', // Darker Wood
          gridCell: '#8d6e63',    // Light Wood grain
          textTitle: 'text-amber-100',
          textSub: 'text-amber-200/70',
          showGrid: true,
          labelColor: 'white',
          fogColor: '#5d4037',
          fogDensity: 0.04
        };
      case AppTheme.CLASSROOM: // Light
        return {
          bg: '#ffffff',
          gridSection: '#cbd5e1', // slate-300
          gridCell: '#e2e8f0',    // slate-200
          textTitle: 'text-gray-900',
          textSub: 'text-gray-600',
          showGrid: true,
          labelColor: 'black',
          fogColor: '#ffffff',
          fogDensity: 0.02
        };
      case AppTheme.BLUEPRINT: // Blueprint Blue
        return {
          bg: '#1e3a8a', // blue-900
          gridSection: '#60a5fa', // blue-400
          gridCell: '#3b82f6',    // blue-500
          textTitle: 'text-white',
          textSub: 'text-blue-200',
          showGrid: true,
          labelColor: 'white',
          fogColor: '#1e3a8a',
          fogDensity: 0.04
        };
      case AppTheme.MINIMAL: // Minimal Grey
        return {
          bg: '#f3f4f6', // gray-100
          gridSection: 'transparent',
          gridCell: 'transparent',
          textTitle: 'text-gray-900',
          textSub: 'text-gray-500',
          showGrid: false,
          labelColor: 'black',
          fogColor: '#f3f4f6',
          fogDensity: 0.0
        };
      case AppTheme.GALAXY: // Default Dark
      default:
        return {
          bg: '#111827', // gray-900
          gridSection: '#4b5563', // gray-600
          gridCell: '#374151',    // gray-700
          textTitle: 'text-white',
          textSub: 'text-[#cccccc]',
          showGrid: true,
          labelColor: 'white',
          fogColor: '#111827',
          fogDensity: 0.03
        };
    }
  }, [state.theme]);

  // Math Calculations (Live)
  const { length: L, width: W, height: H } = state.dimensions;
  
  // Sxq = 2 * (L + W) * H
  // Stp = Sxq + 2 * (L * W)
  // V = L * W * H
  // Round to 2 decimals for display
  const valSxq = parseFloat((2 * (L + W) * H).toFixed(2));
  const valStp = parseFloat((valSxq + (2 * L * W)).toFixed(2));
  const valVol = parseFloat((L * W * H).toFixed(2));

  // Determine HUD Content based on active mode
  const getHudContent = () => {
    switch (state.activeMathMode) {
      case 'SXQ':
        return {
          title: "DIỆN TÍCH XUNG QUANH",
          formula: "Sxq = 2 × (Dài + Rộng) × Cao",
          calc: `Sxq = 2 × (${L} + ${W}) × ${H} =`,
          result: `${valSxq}`,
          unit: "cm²",
          colorClass: "text-yellow-400",
          borderClass: "border-yellow-500/30"
        };
      case 'STP':
        return {
           title: "DIỆN TÍCH TOÀN PHẦN",
           formula: "Stp = Sxq + 2 × (Dài × Rộng)",
           calc: `Stp = ${valSxq} + 2 × (${L} × ${W}) =`,
           result: `${valStp}`,
           unit: "cm²",
           colorClass: "text-orange-400",
           borderClass: "border-orange-500/30"
        };
      case 'VOL':
         return {
           title: "THỂ TÍCH",
           formula: "V = Dài × Rộng × Cao",
           calc: `V = ${L} × ${W} × ${H} =`,
           result: `${valVol}`,
           unit: "cm³",
           colorClass: "text-cyan-400",
           borderClass: "border-cyan-500/30"
         };
      default:
        return null;
    }
  };

  const hudData = getHudContent();

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: themeConfig.bg }}>
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [6, 8, 8], fov: 45 }}
        // IMPORTANT: preserveDrawingBuffer is required for .toDataURL() to work
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={[themeConfig.bg]} />
        <fog attach="fog" args={[themeConfig.fogColor, 10, 50]} />
        
        <SceneEffects state={state} />

        <ambientLight intensity={state.theme === AppTheme.CYBERPUNK ? 1.2 : 0.6} />
        <pointLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <group position={[0, 0, 0]} rotation={[0, state.rotationY, 0]}>
          {state.shape === ShapeType.CUBE && (
            <FoldableCube 
              progress={state.foldProgress} 
              showWireframe={state.showWireframe} 
              showLabels={state.showLabels}
              labelStyle={state.labelStyle}
              labelColor={themeConfig.labelColor}
              showVertices={state.showVertices}
              showDimensions={state.showDimensions}
              size={state.dimensions.length} // Use length as the uniform size for Cube
              faceColors={state.faceColors} // Use faceColors
              baseHue={0}
              faceHues={[]}
              opacity={state.opacity}
              pattern={state.unfoldPattern}
            />
          )}
          {state.shape === ShapeType.RECTANGULAR_PRISM && (
            <FoldableRectangularPrism 
              progress={state.foldProgress} 
              showWireframe={state.showWireframe} 
              showLabels={state.showLabels}
              labelStyle={state.labelStyle}
              labelColor={themeConfig.labelColor}
              showVertices={state.showVertices}
              showDimensions={state.showDimensions}
              dimensions={state.dimensions}
              faceColors={state.faceColors} // Use faceColors
              baseHue={0}
              faceHues={[]}
              opacity={state.opacity}
              pattern={state.unfoldPattern}
            />
          )}
        </group>

        {state.showGrid && themeConfig.showGrid && (
          <Grid 
            infiniteGrid 
            fadeDistance={40} 
            sectionColor={themeConfig.gridSection} 
            cellColor={themeConfig.gridCell} 
            position={[0, -0.05, 0]} // Slightly below zero to avoid z-fighting with base
          />
        )}

        <OrbitControls 
          autoRotate={state.autoRotate} 
          autoRotateSpeed={2}
          makeDefault 
        />
      </Canvas>
      
      {/* 3D MATH HUD OVERLAY */}
      {hudData && (
        <div className={`absolute bottom-[80px] left-1/2 transform -translate-x-1/2 z-40`}>
           <div className={`
              bg-black/80 backdrop-blur-md 
              px-8 py-5 rounded-2xl 
              border ${hudData.borderClass}
              shadow-2xl flex flex-col items-center gap-2
              animate-in fade-in slide-in-from-bottom-4 duration-300
           `}>
              {/* Header Formula */}
              <div className="text-gray-400 font-medium text-sm tracking-wide uppercase mb-1">
                 {hudData.formula}
              </div>

              {/* Calculation Line */}
              <div className="flex items-baseline gap-3 text-white font-mono text-lg whitespace-nowrap">
                 <span className="opacity-80">{hudData.calc}</span>
                 <span className={`text-4xl font-black ${hudData.colorClass} drop-shadow-lg`}>
                   {hudData.result}
                   <span className="text-lg ml-1 opacity-80 text-white font-normal">{hudData.unit}</span>
                 </span>
              </div>
           </div>
        </div>
      )}

      {/* Overlay Instructions */}
      <div className={`absolute top-4 right-4 text-xs pointer-events-none text-right select-none ${themeConfig.textSub} opacity-50`}>
         <p>Giữ chuột trái để xoay</p>
         <p>Giữ chuột phải để di chuyển</p>
         <p>Cuộn chuột để thu phóng</p>
      </div>

      {/* Footer Credits */}
      <div 
        className="absolute bottom-[15px] right-[20px] text-right z-50 pointer-events-none select-none font-sans"
        style={{ textShadow: state.theme === AppTheme.CLASSROOM || state.theme === AppTheme.MINIMAL || state.theme === AppTheme.GRAPH_PAPER ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        <div className={`${themeConfig.textTitle} font-semibold text-[14px] uppercase tracking-[0.5px] mb-[4px] leading-tight`}>
          © 2026 MÔ PHỎNG KHAI TRIỂN HÌNH KHỐI
        </div>
        <div className={`${themeConfig.textSub} font-normal text-[12px] leading-tight`}>
          Phát triển bởi thầy Hồ Quốc Tuấn
        </div>
      </div>
    </div>
  );
};
