
import React, { useMemo } from 'react';
import { Face } from './Face';
import { UnfoldPattern, LabelStyle } from '../../types';
import { DimensionLabel } from './DimensionLabel';

interface FoldableRectangularPrismProps {
  progress: number; // 0 (Closed) -> 1 (Open)
  showWireframe: boolean;
  showLabels: boolean;
  labelStyle?: LabelStyle; // New Prop
  labelColor?: string; // New Prop for Label Text Color
  showVertices?: boolean;
  showDimensions?: boolean;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  faceColors: string[];
  opacity?: number;
  pattern?: UnfoldPattern;
}

export const FoldableRectangularPrism: React.FC<FoldableRectangularPrismProps> = ({ 
  progress, 
  showWireframe, 
  showLabels, 
  labelStyle = 'NUMBERS',
  labelColor = 'white', // Default to white
  showVertices,
  showDimensions = false,
  dimensions,
  faceColors,
  opacity = 0.9,
  pattern = UnfoldPattern.NET_1
}) => {
  const L = dimensions.length;
  const W = dimensions.width; 
  const H = dimensions.height;

  const angle = (1 - progress) * (Math.PI / 2);
  
  // Use colors directly
  const c = useMemo(() => {
    if (faceColors && faceColors.length === 6) {
      return faceColors;
    }
    return [
      '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#06b6d4'
    ];
  }, [faceColors]);

  // Helper to generate label text based on index and style
  const getLabelText = (index: number): string => {
    if (!showLabels || labelStyle === 'BLANK') return "";
    
    switch (labelStyle) {
      case 'LETTERS':
        return String.fromCharCode(65 + index); // 0 -> A, 1 -> B, etc.
      case 'ROMAN':
        const romans = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        return romans[index] || "";
      case 'NUMBERS':
      default:
        return (index + 1).toString();
    }
  };

  // === CẤU HÌNH GÓC XOAY NHÃN (MANUAL ROTATION MATRIX) ===
  // Trả về góc xoay (radian) cho nhãn trên từng mặt để đảm bảo số đứng thẳng
  const getLabelRotation = (index: number): number => {
    // Hàm chuyển đổi độ sang radian
    const rad = (deg: number) => (deg * Math.PI) / 180;

    // --- BẢNG TRA CỨU GÓC XOAY (HARD-CODED MATRIX - FINAL FIX) ---
    // Áp dụng cho mọi dạng khai triển để đảm bảo tính nhất quán theo yêu cầu
    switch (index) {
      case 0: return rad(0);    // Face 1 (Trước): 0 deg
      case 1: return rad(0);    // Face 2 (Trên/Nắp): 0 deg (Đã sửa theo yêu cầu)
      case 2: return rad(180);  // Face 3 (Dưới/Đáy): 180 deg (Đã sửa theo yêu cầu)
      case 3: return rad(-90);  // Face 4 (Phải): -90 deg
      case 4: return rad(90);   // Face 5 (Trái): 90 deg
      case 5: return rad(180);  // Face 6 (Sau): 180 deg
      default: return 0;
    }
  };

  // Helper to pass all common props + dynamic label logic
  const getFaceProps = (index: number) => ({
    showWireframe,
    showVertices,
    opacity,
    label: getLabelText(index),
    labelRotation: getLabelRotation(index),
    textColor: labelColor,
    color: c[index]
  });

  const renderNet = () => {
    switch (pattern) {
      
      case UnfoldPattern.NET_1: // Cross
        return (
          <group>
            {/* Face 1 (Base/Bottom) */}
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            
            {/* Face 2 (Front) */}
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            
            {/* Face 3 (Back) & Face 6 (Top) chain */}
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
            
            {/* Face 4 (Left) */}
            <group position={[-L/2, 0, 0]} rotation={[0, 0, -angle]}>
               <Face {...getFaceProps(3)} width={H} height={W} position={[-H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            
            {/* Face 5 (Right) */}
            <group position={[L/2, 0, 0]} rotation={[0, 0, angle]}>
               <Face {...getFaceProps(4)} width={H} height={W} position={[H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
          </group>
        );

      case UnfoldPattern.NET_2: // Offset A
        return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[-L/2, 0, 0]} rotation={[0, 0, -angle]}>
               <Face {...getFaceProps(3)} width={H} height={W} position={[-H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[L/2, 0, -H/2]} rotation={[0, 0, angle]}>
                   <Face {...getFaceProps(4)} width={W} height={H} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
          </group>
        );

      case UnfoldPattern.NET_3: 
        return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[L/2, 0, -H/2]} rotation={[0, 0, angle]}>
                   <Face {...getFaceProps(4)} width={W} height={H} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[-L/2, 0, -H/2]} rotation={[0, 0, -angle]}>
                   <Face {...getFaceProps(3)} width={W} height={H} position={[-W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
          </group>
        );

      case UnfoldPattern.NET_4: 
        return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
             <group position={[-L/2, 0, 0]} rotation={[0, 0, -angle]}>
               <Face {...getFaceProps(3)} width={H} height={W} position={[-H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
                  <group position={[L/2, 0, -W/2]} rotation={[0, 0, angle]}>
                      <Face {...getFaceProps(4)} width={H} height={W} position={[H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
                  </group>
               </group>
            </group>
          </group>
        );

      case UnfoldPattern.NET_5:
        return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
                  <group position={[-L/2, 0, -W/2]} rotation={[0, 0, -angle]}>
                     <Face {...getFaceProps(3)} width={H} height={W} position={[-H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
                  </group>
                  <group position={[L/2, 0, -W/2]} rotation={[0, 0, angle]}>
                     <Face {...getFaceProps(4)} width={H} height={W} position={[H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
                  </group>
               </group>
            </group>
          </group>
        );

      case UnfoldPattern.NET_6:
        return (
           <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[L/2, 0, 0]} rotation={[0, 0, angle]}>
              <Face {...getFaceProps(4)} width={H} height={W} position={[H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[-L/2, 0, 0]} rotation={[0, 0, -angle]}>
              <Face {...getFaceProps(3)} width={H} height={W} position={[-H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
              <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
                  <group position={[0, 0, -W]} rotation={[angle, 0, 0]}>
                     <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
                  </group>
               </group>
            </group>
           </group>
        );
      
      case UnfoldPattern.NET_7:
         return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[-L/2, 0, -H/2]} rotation={[0, 0, -angle]}>
                   <Face {...getFaceProps(3)} width={W} height={H} position={[-W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[L/2, 0, -H/2]} rotation={[0, 0, angle]}>
                   <Face {...getFaceProps(4)} width={W} height={H} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
          </group>
         );

      case UnfoldPattern.NET_8:
        return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[-L/2, 0, -H/2]} rotation={[0, 0, -angle]}>
                   <Face {...getFaceProps(3)} width={W} height={H} position={[-W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[L/2, 0, H/2]} rotation={[0, 0, angle]}>
                   <Face {...getFaceProps(4)} width={W} height={H} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
          </group>
        );

      case UnfoldPattern.NET_9:
        return (
          <group>
            <Face {...getFaceProps(0)} width={L} height={W} rotation={[-Math.PI/2, 0, 0]} />
            <group position={[0, 0, W/2]} rotation={[-angle, 0, 0]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[0, 0, H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[-L/2, 0, H/2]} rotation={[0, 0, -angle]}>
                  <Face {...getFaceProps(3)} width={W} height={H} position={[-W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
            <group position={[0, 0, -W/2]} rotation={[angle, 0, 0]}>
               <Face {...getFaceProps(2)} width={L} height={H} position={[0, 0, -H/2]} rotation={[-Math.PI/2, 0, 0]} />
               <group position={[0, 0, -H]} rotation={[angle, 0, 0]}>
                  <Face {...getFaceProps(5)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
               <group position={[L/2, 0, -H/2]} rotation={[0, 0, angle]}>
                  <Face {...getFaceProps(4)} width={W} height={H} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
               </group>
            </group>
          </group>
        );

      // ==================================================================================
      // CASE 10: STAIRS (2-2-2)
      // ==================================================================================
      case UnfoldPattern.NET_10:
        return (
          <group>
            {/* FACE 1 (Left) [W, H]. Fixed on grid. */}
            <Face {...getFaceProps(0)} width={W} height={H} rotation={[-Math.PI/2, 0, 0]} />

            {/* FACE 2 (Front) [L, H]. Connects to Right(H) of F1. */}
            <group position={[W/2, 0, 0]} rotation={[0, 0, angle]}>
               <Face {...getFaceProps(1)} width={L} height={H} position={[L/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />

               {/* FACE 3 (Base) [L, W]. Connects to Bottom(L) of F2. */}
               <group position={[L/2, 0, H/2]} rotation={[-angle, 0, 0]}>
                   <Face {...getFaceProps(2)} width={L} height={W} position={[0, 0, W/2]} rotation={[-Math.PI/2, 0, 0]} />

                   {/* FACE 4 (Right) [H, W]. Connects to Right(W) of F3. */}
                   <group position={[L/2, 0, W/2]} rotation={[0, 0, angle]}>
                       <Face {...getFaceProps(3)} width={H} height={W} position={[H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />

                       {/* FACE 5 (Back) [H, L]. Connects to Bottom(H) of F4. */}
                       <group position={[H/2, 0, W/2]} rotation={[-angle, 0, 0]}>
                           <Face {...getFaceProps(4)} width={H} height={L} position={[0, 0, L/2]} rotation={[-Math.PI/2, 0, 0]} />

                           {/* FACE 6 (Top) [W, L]. Connects to Right(L) of F5. */}
                           <group position={[H/2, 0, L/2]} rotation={[0, 0, angle]}>
                               <Face {...getFaceProps(5)} width={W} height={L} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
                           </group>
                       </group>
                   </group>
               </group>
            </group>
          </group>
        );

      // ==================================================================================
      // CASE 11: TWO ROWS (OFFSET 3-3)
      // ==================================================================================
      case UnfoldPattern.NET_11:
         return (
           <group>
             {/* === ROW 2 (BOTTOM ROW) === */}
             
             {/* FACE 1 (FRONT) - Fixed Center of Bottom Row */}
             <Face {...getFaceProps(0)} width={L} height={H} rotation={[-Math.PI/2, 0, 0]} />

             {/* FACE 4 (RIGHT) - Attached to Right of F1 */}
             <group position={[L/2, 0, 0]} rotation={[0, 0, angle]}>
                <Face {...getFaceProps(3)} width={W} height={H} position={[W/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />

                {/* FACE 5 (BACK) - Attached to Right of F4 */}
                <group position={[W, 0, 0]} rotation={[0, 0, angle]}>
                    <Face {...getFaceProps(4)} width={L} height={H} position={[L/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
                </group>
             </group>

             {/* === ROW 1 (TOP ROW) === */}

             {/* FACE 3 (TOP) - Attached to Top of F1 */}
             <group position={[0, 0, -H/2]} rotation={[angle, 0, 0]}>
                <Face {...getFaceProps(2)} width={L} height={W} position={[0, 0, -W/2]} rotation={[-Math.PI/2, 0, 0]} />

                {/* FACE 2 (LEFT) - Attached to Left of F3 */}
                <group position={[-L/2, 0, -W/2]} rotation={[0, 0, -angle]}>
                    <Face {...getFaceProps(1)} width={H} height={W} position={[-H/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />

                    {/* FACE 6 (BOTTOM) - Attached to Left of F2 */}
                    <group position={[-H, 0, 0]} rotation={[0, 0, -angle]}>
                        <Face {...getFaceProps(5)} width={L} height={W} position={[-L/2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} />
                    </group>
                </group>
             </group>
           </group>
         );

      default:
         return null;
    }
  };

  return (
    <group>
      {renderNet()}
      
      {/* 3D Dimensions Labels */}
      {showDimensions && (
        <group>
           {/* Length (L) - Bottom Front Edge */}
           <DimensionLabel 
              position={[0, 0, W/2 + 0.3]} 
              text={`${L.toFixed(1)} cm`} 
           />

           {/* Width (W) - Bottom Right Edge */}
           <DimensionLabel 
              position={[L/2 + 0.3, 0, 0]} 
              text={`${W.toFixed(1)} cm`} 
           />

           {/* Height (H) - Front Left Vertical Edge */}
           <DimensionLabel 
              position={[-L/2 - 0.2, H/2, W/2 + 0.2]} 
              text={`${H.toFixed(1)} cm`} 
           />
        </group>
      )}
    </group>
  );
};
