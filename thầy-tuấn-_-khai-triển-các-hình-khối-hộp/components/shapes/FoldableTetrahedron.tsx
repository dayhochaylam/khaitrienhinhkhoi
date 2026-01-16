import React, { useMemo } from 'react';
import { DoubleSide, CylinderGeometry, EdgesGeometry } from 'three';
import { Text } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

// Removing the manual global declaration as it conflicts with React and R3F types
// declare global {
//   namespace JSX {
//     interface IntrinsicElements extends ThreeElements {}
//   }
// }

interface FoldableTetrahedronProps {
  progress: number;
  showWireframe: boolean;
  showLabels: boolean;
}

const SIZE = 3;
// Geometry calculations for an equilateral triangle
const R = SIZE / Math.sqrt(3);
const A = SIZE / (2 * Math.sqrt(3));

// Dihedral angle of regular tetrahedron is arccos(1/3) approx 70.53 degrees.
// The "fold" angle from flat (180) to closed (70.53) means we rotate UP by (180 - 70.53) = 109.47 degrees.
const FOLD_ANGLE_MAX = Math.PI - Math.acos(1 / 3);

// A helper component for a single triangle face
const TriangleFace = ({ color, label, showWireframe, opacity = 0.9 }: any) => {
  // Memoize geometry
  const geometry = useMemo(() => {
    return new CylinderGeometry(R, R, 0.05, 3, 1);
  }, []);

  // Memoize edges to prevent context loss
  const edges = useMemo(() => {
    return new EdgesGeometry(geometry);
  }, [geometry]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} side={DoubleSide} transparent opacity={opacity} />
      </mesh>
      {showWireframe && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="white" linewidth={2} />
        </lineSegments>
      )}
      {label && (
         <Text position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.8} color="white">
           {label}
         </Text>
      )}
    </group>
  );
};

export const FoldableTetrahedron: React.FC<FoldableTetrahedronProps> = ({ progress, showWireframe, showLabels }) => {
  const angle = (1 - progress) * FOLD_ANGLE_MAX;

  const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

  return (
    <group>
      {/* Base Face (Static) */}
      <group rotation={[0, Math.PI, 0]}> 
          {/* Rotate 180 Y to align edges for children conveniently */}
         <TriangleFace color={colors[0]} label={showLabels ? "1" : ""} showWireframe={showWireframe} />
      </group>

      {/* Face 1 */}
      <group rotation={[0, Math.PI / 6, 0]}> 
         {/* Rotate coordinate system so edge is along X axis */}
         <group position={[0, 0, A]}> {/* Move to edge */}
            <group rotation={[angle, 0, 0]}> {/* Hinge X */}
               <group position={[0, 0, A]}> {/* Move center of new face relative to hinge */}
                  <group rotation={[0, Math.PI, 0]}> {/* Flip triangle orientation to mesh */}
                     <TriangleFace color={colors[1]} label={showLabels ? "2" : ""} showWireframe={showWireframe} />
                  </group>
               </group>
            </group>
         </group>
      </group>

      {/* Face 2 */}
      <group rotation={[0, Math.PI / 6 + (2 * Math.PI / 3), 0]}> 
         <group position={[0, 0, A]}>
            <group rotation={[angle, 0, 0]}>
               <group position={[0, 0, A]}>
                  <group rotation={[0, Math.PI, 0]}>
                     <TriangleFace color={colors[2]} label={showLabels ? "3" : ""} showWireframe={showWireframe} />
                  </group>
               </group>
            </group>
         </group>
      </group>

      {/* Face 3 */}
      <group rotation={[0, Math.PI / 6 + (4 * Math.PI / 3), 0]}> 
         <group position={[0, 0, A]}>
            <group rotation={[angle, 0, 0]}>
               <group position={[0, 0, A]}>
                  <group rotation={[0, Math.PI, 0]}>
                     <TriangleFace color={colors[3]} label={showLabels ? "4" : ""} showWireframe={showWireframe} />
                  </group>
               </group>
            </group>
         </group>
      </group>

    </group>
  );
};