
import React, { useMemo } from 'react';
import { Text, Edges } from '@react-three/drei';
import { DoubleSide, BoxGeometry, CylinderGeometry } from 'three';
import { ThreeElements } from '@react-three/fiber';

interface FaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  label?: string;
  labelRotation?: number; // New prop: Rotation angle in radians (0, PI/2, etc.)
  textColor?: string; // New prop: Custom color for the label text
  opacity?: number;
  showWireframe?: boolean;
  showVertices?: boolean;
  hiddenVertices?: number[]; // Indices of vertices to hide [0:TL, 1:TR, 2:BL, 3:BR]
  geometryType?: 'box' | 'triangle';
  size?: number; // Deprecated/Fallback for square
  width?: number;
  height?: number;
}

export const Face: React.FC<FaceProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  label,
  labelRotation = 0, // Default to 0 rotation
  textColor = 'white', // Default to white text
  opacity = 0.9,
  showWireframe = false,
  showVertices = false,
  hiddenVertices = [],
  geometryType = 'box',
  size = 2,
  width,
  height,
}) => {
  // Use width/height if provided, otherwise fallback to size
  const w = width ?? size;
  const h = height ?? size;

  // Thickness of the face
  const THICKNESS = 0.05;

  // Memoize geometry to prevent creating new instances on every render
  const geometry = useMemo(() => {
    if (geometryType === 'box') {
      // Box is created in XY plane with Z thickness
      return new BoxGeometry(w, h, THICKNESS);
    } else {
      // Cylinder (Triangle Prism) logic preserved for compatibility
      return new CylinderGeometry(size / Math.sqrt(3), size / Math.sqrt(3), THICKNESS, 3, 1);
    }
  }, [geometryType, size, w, h]);

  // Calculate vertex positions for Box geometry
  // Indices: 0: TL, 1: TR, 2: BL, 3: BR (Standard Plane mapping)
  // Z set to 0 to align exactly with the geometric center plane, preventing visual sliding during rotation.
  const vertices = useMemo(() => [
    { id: 0, pos: [-w / 2, h / 2, 0] }, // Top Left
    { id: 1, pos: [w / 2, h / 2, 0] },  // Top Right
    { id: 2, pos: [-w / 2, -h / 2, 0] }, // Bottom Left
    { id: 3, pos: [w / 2, -h / 2, 0] },  // Bottom Right
  ], [w, h]);

  // Calculate label font size
  const fontSize = (Math.min(w, h)) * 0.4;
  
  // Z-offset for labels to sit slightly above/below the surface (Surface is at +/- THICKNESS/2)
  // Surface = 0.025. Offset = 0.01. Total = 0.035. Using 0.04 for safety.
  const LABEL_Z_OFFSET = THICKNESS / 2 + 0.015;

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial
          color={color}
          side={DoubleSide}
          transparent
          opacity={opacity}
          roughness={0.4}
          metalness={0.1}
        />
        
        {/* Render wireframe edges if enabled using Drei Edges for continuous lines */}
        {showWireframe && (
          <Edges 
            threshold={15} 
            color="white"
            renderOrder={1} 
          />
        )}
      </mesh>

      {/* Render Vertices (Red Spheres) */}
      {showVertices && geometryType === 'box' && (
        <group>
          {vertices.map((v) => {
            if (hiddenVertices.includes(v.id)) return null;
            return (
              <mesh key={v.id} position={v.pos as [number, number, number]}>
                {/* Reduced radius to 0.11 (~25% smaller) for a refined look */}
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.6} />
              </mesh>
            );
          })}
        </group>
      )}

      {label && (
        <group>
          {/* 1. MẶT NGOÀI (Outer Label) */}
          {/* Sử dụng trực tiếp labelRotation theo bảng matrix */}
          <Text
            position={[0, 0, LABEL_Z_OFFSET]}
            rotation={[0, 0, labelRotation]} 
            fontSize={fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>

          {/* 2. MẶT TRONG (Inner Label) */}
          {/* Logic: Xoay trục Y 180 độ (lật vào trong) + Giữ nguyên Z-Rotation của mặt ngoài */}
          <Text
            position={[0, 0, -LABEL_Z_OFFSET]}
            rotation={[0, Math.PI, labelRotation]} 
            fontSize={fontSize}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
};
