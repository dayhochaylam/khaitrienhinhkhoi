
import React, { useState } from 'react';
import { AppState, ShapeType, UnfoldPattern, AppTheme, MathMode, LabelStyle } from '../types';
import { Minus, Plus, GitGraph, Square, Maximize, Minimize, Palette, Scan, LayoutGrid, Box, Ruler, Check, Type } from 'lucide-react';

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

// Preset Colors for the Grid
const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#FFFFFF', // White
  '#9CA3AF', // Gray
  '#4B5563', // Dark Gray
  '#1F2937', // Black (ish)
  '#78350F', // Brown
  '#D97706', // Amber
];

export const Sidebar: React.FC<SidebarProps> = ({ state, setState }) => {
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number>(0);
  
  const handleMathModeChange = (mode: MathMode) => {
    // Toggle: If clicking the active mode, turn it off. Otherwise, switch to new mode.
    setState(prev => ({
      ...prev,
      activeMathMode: prev.activeMathMode === mode ? 'NONE' : mode
    }));
  };

  const handleShapeChange = (shape: ShapeType) => {
    setState(prev => ({ 
      ...prev, 
      shape, 
      foldProgress: 0.5,
      isPlaying: false,
      rotationY: 0, 
      dimensions: shape === ShapeType.CUBE 
        ? { length: 2, width: 2, height: 2 } 
        : { length: 3, width: 2, height: 1.5 }
    })); 
  };

  const handlePatternChange = (pattern: UnfoldPattern) => {
    // === AUTO-OPTIMIZE DIMENSIONS (TỰ ĐỘNG TỐI ƯU) ===
    let presetDims = { ...state.dimensions };
    
    if (state.shape === ShapeType.RECTANGULAR_PRISM) {
      switch (pattern) {
        case UnfoldPattern.NET_2: // Cánh lệch - Needs distinct sizes to avoid collision
          presetDims = { length: 3.0, width: 2.0, height: 1.5 };
          break;
        case UnfoldPattern.NET_10: // Stairs - Best as cube-like
          presetDims = { length: 2.0, width: 2.0, height: 2.0 };
          break;
        case UnfoldPattern.NET_6: // Long Strip
        case UnfoldPattern.NET_11: // 3-3
          presetDims = { length: 4.0, width: 1.5, height: 1.0 };
          break;
        case UnfoldPattern.NET_7: // 1-3-2 variants
        case UnfoldPattern.NET_8: 
        case UnfoldPattern.NET_9:
          presetDims = { length: 3.0, width: 2.0, height: 1.5 };
          break;
        default: // Standard Cross
          presetDims = { length: 3.0, width: 2.0, height: 1.5 };
          break;
      }
    }

    setState(prev => ({
      ...prev,
      unfoldPattern: pattern,
      dimensions: presetDims,
      foldProgress: 0.5 
    }));
  };

  const handleThemeChange = (theme: AppTheme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const updateDimension = (key: keyof AppState['dimensions'], value: number) => {
    const clamped = Math.max(0.5, Math.min(6, parseFloat(value.toFixed(1))));
    setState(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [key]: clamped
      }
    }));
  };

  const handleFoldAction = (direction: 1 | -1) => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
      animationDirection: direction
    }));
  };

  const handleStop = () => {
    setState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const handleColorUpdate = (color: string) => {
    const newColors = [...state.faceColors];
    newColors[selectedFaceIndex] = color;
    setState(prev => ({ ...prev, faceColors: newColors }));
  };

  const DimensionControl = ({ 
    label, 
    value, 
    onChange, 
    colorClass 
  }: { 
    label: string, 
    value: number, 
    onChange: (val: number) => void, 
    colorClass: string 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] uppercase font-bold tracking-wide text-gray-400">
        <span className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colorClass} shadow-sm`}></div>
          {label}
        </span>
        <span className="font-mono text-white text-xs bg-gray-900 px-2 py-0.5 rounded border border-gray-700">{value.toFixed(1)} cm</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onChange(value - 0.1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors border border-gray-600 active:bg-gray-800 shadow-sm"
          title="Giảm 0.1"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1" 
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-indigo-500`}
        />
        <button 
          onClick={() => onChange(value + 0.1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors border border-gray-600 active:bg-gray-800 shadow-sm"
          title="Tăng 0.1"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-80 h-full bg-[#111827] border-r border-gray-800 flex flex-col shadow-2xl z-10 text-gray-300 font-sans">
      
      {/* HEADER */}
      <div className="py-6 px-4 border-b border-gray-800 bg-[#0f1523] shrink-0 text-center relative shadow-lg z-20">
        <h1 
          className="text-xl font-black tracking-tight mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-orange-400 bg-clip-text text-transparent leading-tight whitespace-nowrap" 
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        >
          TOÁN HỌC TRỰC QUAN 3D
        </h1>
        <div className="inline-block border-t border-gray-700/50 pt-3 px-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            Chủ đề: Khai Triển Hình Hộp
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {/* Custom Scrollbar Styles & Range Slider Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #374151;
            border-radius: 9999px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #4b5563;
          }
        `}</style>
        
        {/* BLOCK 1: CONFIGURATION */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
            <span className="text-base filter grayscale opacity-90">📦</span>
            <span>1. Cấu hình Khối</span>
          </h2>
          
          <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-5 hover:border-gray-600 transition-colors shadow-sm">
            <div className="flex bg-gray-900/50 p-1 rounded-lg border border-gray-700/50">
              <button
                onClick={() => handleShapeChange(ShapeType.CUBE)}
                className={`flex-1 py-2.5 rounded-md text-[10px] font-bold transition-all ${
                  state.shape === ShapeType.CUBE
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                HÌNH LẬP PHƯƠNG
              </button>
              <button
                onClick={() => handleShapeChange(ShapeType.RECTANGULAR_PRISM)}
                className={`flex-1 py-2.5 rounded-md text-[10px] font-bold transition-all ${
                  state.shape === ShapeType.RECTANGULAR_PRISM
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                HÌNH HỘP CN
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 ml-1">
                 <GitGraph size={12} className="text-indigo-400" />
                 Kiểu Khai Triển (11 Dạng)
              </label>
              <div className="relative group">
                <select 
                  value={state.unfoldPattern}
                  onChange={(e) => handlePatternChange(e.target.value as UnfoldPattern)}
                  className="w-full bg-gray-900 border border-gray-600 text-white text-xs font-medium rounded-lg p-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all shadow-inner hover:border-gray-500"
                >
                  <optgroup label="Nhóm 1-4-1 (Cơ bản)">
                    <option value={UnfoldPattern.NET_1}>Dạng 1: Chữ Thập (Cơ bản)</option>
                    <option value={UnfoldPattern.NET_2}>Dạng 2: Cánh Lệch (Base/Back)</option>
                    <option value={UnfoldPattern.NET_3}>Dạng 3: Chữ T (Cánh ở Back)</option>
                    <option value={UnfoldPattern.NET_4}>Dạng 4: Cánh Xa (Base/Top)</option>
                    <option value={UnfoldPattern.NET_5}>Dạng 5: Cánh ở Top</option>
                    <option value={UnfoldPattern.NET_6}>Dạng 6: Cánh ở Front/Back</option>
                  </optgroup>
                  <optgroup label="Nhóm 1-3-2 (Phức tạp)">
                    <option value={UnfoldPattern.NET_7}>Dạng 7: 1-3-2 (Kiểu A)</option>
                    <option value={UnfoldPattern.NET_8}>Dạng 8: 1-3-2 (Kiểu B)</option>
                    <option value={UnfoldPattern.NET_9}>Dạng 9: 1-3-2 (Kiểu C)</option>
                  </optgroup>
                  <optgroup label="Nhóm Đặc Biệt">
                    <option value={UnfoldPattern.NET_10}>Dạng 10: Bậc Thang (2-2-2)</option>
                    <option value={UnfoldPattern.NET_11}>Dạng 11: Hai Hàng (3-3)</option>
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2: DIMENSIONS */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
            <span className="text-base filter grayscale opacity-90">📏</span>
            <span>2. Kích thước (cm)</span>
          </h2>

          <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-5 hover:border-gray-600 transition-colors shadow-sm">
             <DimensionControl 
                label="Chiều Dài (L)" 
                value={state.dimensions.length} 
                onChange={(v) => updateDimension('length', v)} 
                colorClass="bg-red-500"
             />
             <DimensionControl 
                label="Chiều Rộng (W)" 
                value={state.dimensions.width} 
                onChange={(v) => updateDimension('width', v)} 
                colorClass="bg-yellow-500"
             />
             <DimensionControl 
                label="Chiều Cao (H)" 
                value={state.dimensions.height} 
                onChange={(v) => updateDimension('height', v)} 
                colorClass="bg-blue-500"
             />
             
             {state.shape === ShapeType.RECTANGULAR_PRISM && (
                <div className="pt-3 border-t border-gray-700/50">
                   <p className="text-[10px] text-emerald-400/80 italic text-center font-medium bg-emerald-900/10 py-2 rounded border border-emerald-900/20">
                     ✨ Kích thước tối ưu cho dạng này
                   </p>
                </div>
             )}

             {/* SHOW DIMENSION LABELS TOGGLE */}
             <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={state.showDimensions} 
                    onChange={(e) => setState(p => ({...p, showDimensions: e.target.checked}))} 
                    className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all cursor-pointer" 
                  />
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-wide">
                    <Ruler size={12} className={state.showDimensions ? "text-indigo-400" : "text-gray-500"} />
                    Hiển thị số đo trên cạnh
                  </span>
                </label>
             </div>
          </div>
        </div>

        {/* BLOCK 3: MATH CORNER */}
        <div className="space-y-4">
           <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
             <span className="text-base filter grayscale opacity-90">📐</span>
             <span>3. Góc Toán Học</span>
           </h2>

           <div className="bg-gray-800/40 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50 flex flex-col gap-2 hover:border-gray-600 transition-colors shadow-sm">
              <button
                onClick={() => handleMathModeChange('SXQ')}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group ${
                  state.activeMathMode === 'SXQ' 
                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                    : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <div className={`p-1.5 rounded-md ${state.activeMathMode === 'SXQ' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 group-hover:text-gray-300'}`}>
                   <Scan size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start">
                   <span className="text-xs font-bold uppercase tracking-wide">Diện tích Xung quanh</span>
                   <span className="text-[10px] font-mono opacity-70">Sxq = 2 × (L + W) × H</span>
                </div>
              </button>

              <button
                onClick={() => handleMathModeChange('STP')}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group ${
                  state.activeMathMode === 'STP' 
                    ? 'bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]' 
                    : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <div className={`p-1.5 rounded-md ${state.activeMathMode === 'STP' ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-400 group-hover:text-gray-300'}`}>
                   <LayoutGrid size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start">
                   <span className="text-xs font-bold uppercase tracking-wide">Diện tích Toàn phần</span>
                   <span className="text-[10px] font-mono opacity-70">Stp = Sxq + 2 × (L × W)</span>
                </div>
              </button>

              <button
                onClick={() => handleMathModeChange('VOL')}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group ${
                  state.activeMathMode === 'VOL' 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                    : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <div className={`p-1.5 rounded-md ${state.activeMathMode === 'VOL' ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400 group-hover:text-gray-300'}`}>
                   <Box size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start">
                   <span className="text-xs font-bold uppercase tracking-wide">Thể Tích</span>
                   <span className="text-[10px] font-mono opacity-70">V = L × W × H</span>
                </div>
              </button>
           </div>
        </div>

        {/* BLOCK 4: COLORS */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
            <span className="text-base filter grayscale opacity-90">🎨</span>
            <span>4. Màu Sắc Các Mặt</span>
          </h2>

          <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-4 hover:border-gray-600 transition-colors shadow-sm">
             
             {/* Part A: Face Selectors */}
             <div className="space-y-2">
               <div className="text-[10px] font-bold text-gray-500 uppercase">Chọn mặt để đổi màu</div>
               <div className="flex justify-between gap-1">
                 {state.faceColors.map((color, idx) => (
                   <button
                     key={idx}
                     onClick={() => setSelectedFaceIndex(idx)}
                     className={`
                       w-9 h-9 rounded-full flex items-center justify-center 
                       text-[11px] font-bold text-white shadow-sm transition-all duration-200
                       hover:scale-110 active:scale-95
                       ${selectedFaceIndex === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' : 'opacity-80 hover:opacity-100'}
                     `}
                     style={{ 
                       backgroundColor: color,
                       textShadow: '0px 1px 2px rgba(0,0,0,0.6)'
                     }}
                   >
                     {idx + 1}
                   </button>
                 ))}
               </div>
             </div>

             {/* Part B: Color Palette Grid */}
             <div className="space-y-2 pt-2 border-t border-gray-700/50">
               <div className="flex justify-between items-center">
                 <div className="text-[10px] font-bold text-gray-500 uppercase">Bảng màu</div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-3 h-3 rounded-full border border-gray-600" style={{backgroundColor: state.faceColors[selectedFaceIndex]}}></div>
                   <span className="text-[10px] font-mono text-gray-400">{state.faceColors[selectedFaceIndex]}</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-8 gap-2">
                 {PRESET_COLORS.map((color) => (
                   <button
                     key={color}
                     onClick={() => handleColorUpdate(color)}
                     className={`
                       w-6 h-6 rounded-md shadow-sm transition-transform hover:scale-125 hover:z-10
                       border border-gray-600/30
                       ${state.faceColors[selectedFaceIndex] === color ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-gray-800' : ''}
                     `}
                     style={{ backgroundColor: color }}
                     title={color}
                   >
                     {state.faceColors[selectedFaceIndex] === color && (
                       <Check size={12} className="text-black/50 mx-auto" strokeWidth={3} />
                     )}
                   </button>
                 ))}
               </div>
             </div>
             
          </div>
        </div>

        {/* BLOCK 5: SIMULATION */}
        <div className="space-y-4">
           <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
             <span className="text-base filter grayscale opacity-90">▶️</span>
             <span>5. Mô phỏng</span>
           </h2>

           <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-4 hover:border-gray-600 transition-colors shadow-sm">
             <div className="flex gap-2">
               <button 
                 onClick={() => handleFoldAction(1)}
                 disabled={state.foldProgress >= 1 && !state.isPlaying}
                 className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-600 transition-all flex flex-col items-center justify-center gap-1.5 group shadow-sm active:translate-y-0.5"
               >
                 <Maximize size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-bold text-gray-300">MỞ HÌNH</span>
               </button>
               
               <button 
                 onClick={() => handleFoldAction(-1)}
                 disabled={state.foldProgress <= 0 && !state.isPlaying}
                 className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-600 transition-all flex flex-col items-center justify-center gap-1.5 group shadow-sm active:translate-y-0.5"
               >
                 <Minimize size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-bold text-gray-300">GẤP HÌNH</span>
               </button>

               <button 
                 onClick={handleStop}
                 disabled={!state.isPlaying}
                 className="w-12 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 active:bg-red-500/30"
               >
                 <Square size={16} fill="currentColor" />
               </button>
             </div>

             {/* Progress Bar */}
             <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50 shadow-inner">
               <div className="flex justify-between text-[10px] font-mono mb-2">
                 <span className="text-gray-500 font-bold uppercase tracking-wider">Trạng thái</span>
                 <span className={state.foldProgress === 0 ? "text-amber-500 font-bold" : state.foldProgress === 1 ? "text-emerald-500 font-bold" : "text-blue-400"}>
                   {state.foldProgress === 0 ? "HÌNH HỘP (3D)" : state.foldProgress === 1 ? "MẶT PHẲNG (2D)" : `${Math.round(state.foldProgress * 100)}%`}
                 </span>
               </div>
               <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden relative border border-gray-600/50">
                  <div 
                    className={`h-full absolute left-0 top-0 transition-all duration-300 ${
                      state.foldProgress === 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : state.foldProgress === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${state.foldProgress * 100}%` }}
                  ></div>
               </div>
             </div>
           </div>
        </div>

        {/* BLOCK 6: ENVIRONMENT & THEME */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
            <span className="text-base filter grayscale opacity-90">🖼️</span>
            <span>6. Không gian & Môi trường</span>
          </h2>

           <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-4 hover:border-gray-600 transition-colors shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 ml-1">
                   <Palette size={12} className="text-pink-400" />
                   Giao diện hiển thị
                </label>
                <div className="relative group">
                  <select 
                    value={state.theme}
                    onChange={(e) => handleThemeChange(e.target.value as AppTheme)}
                    className="w-full bg-gray-900 border border-gray-600 text-white text-xs font-medium rounded-lg p-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer transition-all shadow-inner hover:border-gray-500"
                  >
                    <option value={AppTheme.GALAXY}>🌌 Vũ Trụ (Mặc định)</option>
                    <option value={AppTheme.CLASSROOM}>🏫 Lớp Học (Sáng)</option>
                    <option value={AppTheme.BLUEPRINT}>📐 Bản Vẽ (Kỹ thuật)</option>
                    <option value={AppTheme.MINIMAL}>🌫️ Tối Giản</option>
                    <option disabled>──────────</option>
                    <option value={AppTheme.GRAPH_PAPER}>📝 Giấy Ô Ly</option>
                    <option value={AppTheme.CYBERPUNK}>✨ Cyberpunk (Neon)</option>
                    <option value={AppTheme.CHALKBOARD}>🏫 Bảng Phấn</option>
                    <option value={AppTheme.MINECRAFT}>🧱 Minecraft (Voxel)</option>
                    <option value={AppTheme.WOODEN_DESK}>🪵 Mặt Bàn Gỗ</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* BLOCK 7: VIEW SETTINGS */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-1">
            <span className="text-base filter grayscale opacity-90">⚙️</span>
            <span>7. Tùy chọn hiển thị</span>
          </h2>
          
          <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-3 hover:border-gray-600 transition-colors shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                    <input type="checkbox" checked={state.showWireframe} onChange={(e) => setState(p => ({...p, showWireframe: e.target.checked}))} className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all cursor-pointer" />
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Hiện Cạnh</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                    <input type="checkbox" checked={state.showVertices} onChange={(e) => setState(p => ({...p, showVertices: e.target.checked}))} className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all cursor-pointer" />
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Hiện Đỉnh</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                    <input type="checkbox" checked={state.autoRotate} onChange={(e) => setState(p => ({...p, autoRotate: e.target.checked}))} className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all cursor-pointer" />
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Tự Xoay</span>
                </label>
              </div>

              {/* Enhanced Label Control */}
              <div className="pt-2 border-t border-gray-700/50 space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                    <input type="checkbox" checked={state.showLabels} onChange={(e) => setState(p => ({...p, showLabels: e.target.checked}))} className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-offset-gray-900 transition-all cursor-pointer" />
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">Hiện Nhãn</span>
                </label>
                
                {/* Label Style Dropdown - Only show if labels are enabled */}
                <div className={`transition-all duration-300 overflow-hidden ${state.showLabels ? 'max-h-20 opacity-100' : 'max-h-0 opacity-50'}`}>
                    <div className="flex items-center gap-2 pl-6">
                        <Type size={12} className="text-gray-500" />
                        <select 
                            value={state.labelStyle} 
                            onChange={(e) => setState(p => ({...p, labelStyle: e.target.value as LabelStyle}))}
                            disabled={!state.showLabels}
                            className="flex-1 bg-gray-900 border border-gray-600 text-white text-[10px] font-medium rounded py-1 px-2 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="NUMBERS">Số (1 - 6)</option>
                            <option value="LETTERS">Chữ cái (A - F)</option>
                            <option value="ROMAN">La Mã (I - VI)</option>
                            <option value="BLANK">Trống (Không hiện)</option>
                        </select>
                    </div>
                </div>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};
