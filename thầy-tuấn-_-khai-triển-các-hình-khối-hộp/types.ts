
export enum ShapeType {
  CUBE = 'CUBE',
  RECTANGULAR_PRISM = 'RECTANGULAR_PRISM',
}

export enum UnfoldPattern {
  // GROUP 1-4-1 (6 Types)
  NET_1 = 'NET_1', // Classic Cross (Wings on Base)
  NET_2 = 'NET_2', // Wings on Base & Back
  NET_3 = 'NET_3', // Wings on Back
  NET_4 = 'NET_4', // Wings on Base & Top
  NET_5 = 'NET_5', // Wings on Top
  NET_6 = 'NET_6', // Wings on Front & Back (Long)

  // GROUP 1-3-2 (3 Types)
  NET_7 = 'NET_7', // 1-3-2 Standard
  NET_8 = 'NET_8', // 1-3-2 Variant A
  NET_9 = 'NET_9', // 1-3-2 Variant B

  // GROUP 2-2-2 (1 Type)
  NET_10 = 'NET_10', // Stairs

  // GROUP 3-3 (1 Type)
  NET_11 = 'NET_11', // Two rows of 3
}

export enum AppTheme {
  GALAXY = 'GALAXY',     // Dark/Blue Black (Default)
  CLASSROOM = 'CLASSROOM', // White (Projector friendly)
  BLUEPRINT = 'BLUEPRINT', // Blueprint Blue (Technical)
  MINIMAL = 'MINIMAL',     // Light Grey, No Grid
  
  // NEW THEMES
  GRAPH_PAPER = 'GRAPH_PAPER', // Giấy ô ly
  CYBERPUNK = 'CYBERPUNK',     // Neon
  CHALKBOARD = 'CHALKBOARD',   // Bảng phấn
  MINECRAFT = 'MINECRAFT',     // Voxel/Sky
  WOODEN_DESK = 'WOODEN_DESK', // Mặt bàn gỗ
}

export type MathMode = 'NONE' | 'SXQ' | 'STP' | 'VOL';

export type LabelStyle = 'NUMBERS' | 'LETTERS' | 'ROMAN' | 'BLANK';

export interface AppState {
  shape: ShapeType;
  unfoldPattern: UnfoldPattern;
  foldProgress: number; // 0 (Folded/3D) to 1 (Unfolded/Flat)
  showWireframe: boolean;
  showLabels: boolean;
  labelStyle: LabelStyle; // New: Controls the text content of labels
  showGrid: boolean;
  showVertices: boolean;
  showDimensions: boolean; // New: Show dimension labels on 3D edges
  autoRotate: boolean;
  isPlaying: boolean;
  animationDirection: 1 | -1; // 1 = Unfold, -1 = Fold
  dimensions: {
    length: number; // X
    width: number;  // Z (Depth)
    height: number; // Y (Height)
  };
  faceColors: string[]; // Array of 6 hex color strings
  opacity: number; // 0-1
  rotationY: number; // Y-axis rotation in radians
  theme: AppTheme;
  activeMathMode: MathMode; // Tracks which math formula is displayed on HUD
  
  // Triggers (Counters that trigger effects when incremented)
  screenshotTrigger: number;
  resetCameraTrigger: number;
}
