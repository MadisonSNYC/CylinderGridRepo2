import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Settings, Eye, RotateCw, Move, Layers, Box, Undo2, Redo2 } from 'lucide-react';

export const AdvancedHelixPanel = ({ helixConfig, onConfigChange, onReset, onUndo, onRedo, canUndo, canRedo }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateConfig = (key, value) => {
    onConfigChange?.(key, value);
  };

  const SliderControl = ({ label, value, min, max, step = 1, suffix = '', onChange, color = '#3b82f6' }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-300">{label}</label>
        <span className="text-xs font-mono text-blue-400">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{min}{suffix}</span>
        <span className="text-xs text-gray-500">{max}{suffix}</span>
      </div>
    </div>
  );

  const SectionHeader = ({ icon, title, percentage }) => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-blue-400 text-sm uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {percentage !== undefined && (
        <span className="text-xs text-blue-300 font-mono">
          ({percentage}%)
        </span>
      )}
    </div>
  );

  return (
    <div className={`fixed top-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 shadow-2xl transition-transform duration-300 ${
      isCollapsed ? 'translate-x-full' : 'translate-x-0'
    }`} style={{ width: '350px', height: '100vh' }}>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-l-lg p-2 shadow-sm hover:bg-gray-800 transition-colors"
      >
        <Settings className="w-4 h-4 text-blue-400" />
      </button>

      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">HELIX CONTROLS</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onUndo}
              disabled={!canUndo}
              className="text-xs px-2 py-1 h-7 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo last change (Ctrl+Z)"
            >
              <Undo2 className="w-3 h-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRedo}
              disabled={!canRedo}
              className="text-xs px-2 py-1 h-7 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo last undone change (Ctrl+Y)"
            >
              <Redo2 className="w-3 h-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="text-xs px-3 py-1 h-7 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Global Perspective Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <SectionHeader 
            icon={<Eye className="w-4 h-4 text-blue-400" />}
            title="Global Perspective"
          />
          
          <SliderControl
            label="PERSPECTIVE"
            value={helixConfig.perspective || 1200}
            min={500}
            max={3000}
            step={50}
            suffix="px"
            onChange={(val) => updateConfig('perspective', val)}
            color="#3b82f6"
          />

          <SliderControl
            label="ORIGIN X"
            value={helixConfig.perspectiveOriginX || 50}
            min={0}
            max={100}
            suffix="%"
            onChange={(val) => updateConfig('perspectiveOriginX', val)}
            color="#10b981"
          />

          <SliderControl
            label="ORIGIN Y"
            value={helixConfig.perspectiveOriginY || 50}
            min={0}
            max={100}
            suffix="%"
            onChange={(val) => updateConfig('perspectiveOriginY', val)}
            color="#10b981"
          />
        </div>

        {/* Helix Structure Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <SectionHeader 
            icon={<RotateCw className="w-4 h-4 text-purple-400" />}
            title="Helix Structure"
          />
          
          <SliderControl
            label="RADIUS"
            value={helixConfig.radius || 250}
            min={100}
            max={500}
            step={10}
            suffix="px"
            onChange={(val) => updateConfig('radius', val)}
            color="#8b5cf6"
          />

          <SliderControl
            label="VERTICAL SPAN"
            value={helixConfig.verticalSpan || 800}
            min={400}
            max={1600}
            step={50}
            suffix="px"
            onChange={(val) => updateConfig('verticalSpan', val)}
            color="#8b5cf6"
          />

          <SliderControl
            label="REPEAT TURNS"
            value={helixConfig.repeatTurns || 2}
            min={1}
            max={5}
            step={0.5}
            onChange={(val) => updateConfig('repeatTurns', val)}
            color="#8b5cf6"
          />

          <SliderControl
            label="GLOBAL ROTATE X"
            value={helixConfig.rotateX || -10}
            min={-45}
            max={45}
            suffix="°"
            onChange={(val) => updateConfig('rotateX', val)}
            color="#f59e0b"
          />

          <SliderControl
            label="GLOBAL ROTATE Y"
            value={helixConfig.rotateY || 0}
            min={-180}
            max={180}
            suffix="°"
            onChange={(val) => updateConfig('rotateY', val)}
            color="#f59e0b"
          />

          <SliderControl
            label="GLOBAL ROTATE Z"
            value={helixConfig.rotateZ || 0}
            min={-45}
            max={45}
            suffix="°"
            onChange={(val) => updateConfig('rotateZ', val)}
            color="#f59e0b"
          />
        </div>

        {/* Card Properties Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <SectionHeader 
            icon={<Box className="w-4 h-4 text-emerald-400" />}
            title="Card Properties"
          />
          
          <SliderControl
            label="CARD WIDTH"
            value={helixConfig.cardWidth || 80}
            min={50}
            max={120}
            step={5}
            suffix="px"
            onChange={(val) => updateConfig('cardWidth', val)}
            color="#10b981"
          />

          <SliderControl
            label="CARD HEIGHT"
            value={helixConfig.cardHeight || 142}
            min={80}
            max={200}
            step={5}
            suffix="px"
            onChange={(val) => updateConfig('cardHeight', val)}
            color="#10b981"
          />

          <SliderControl
            label="CARD SCALE"
            value={helixConfig.cardScale || 1}
            min={0.5}
            max={2}
            step={0.1}
            onChange={(val) => updateConfig('cardScale', val)}
            color="#10b981"
          />

          <SliderControl
            label="OPACITY FRONT"
            value={helixConfig.opacityFront || 1}
            min={0.3}
            max={1}
            step={0.1}
            onChange={(val) => updateConfig('opacityFront', val)}
            color="#06b6d4"
          />

          <SliderControl
            label="OPACITY SIDE"
            value={helixConfig.opacitySide || 0.7}
            min={0.2}
            max={1}
            step={0.1}
            onChange={(val) => updateConfig('opacitySide', val)}
            color="#06b6d4"
          />

          <SliderControl
            label="OPACITY BACK"
            value={helixConfig.opacityBack || 0.3}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(val) => updateConfig('opacityBack', val)}
            color="#06b6d4"
          />
        </div>

        {/* Container Properties Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <SectionHeader 
            icon={<Move className="w-4 h-4 text-yellow-400" />}
            title="Container"
          />
          
          <SliderControl
            label="CONTAINER WIDTH"
            value={helixConfig.containerWidth || 600}
            min={400}
            max={1000}
            step={50}
            suffix="px"
            onChange={(val) => updateConfig('containerWidth', val)}
            color="#f59e0b"
          />

          <SliderControl
            label="CONTAINER HEIGHT"
            value={helixConfig.containerHeight || 600}
            min={400}
            max={1000}
            step={50}
            suffix="px"
            onChange={(val) => updateConfig('containerHeight', val)}
            color="#f59e0b"
          />

          <SliderControl
            label="SCROLL SENSITIVITY"
            value={helixConfig.scrollSensitivity || 1}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(val) => updateConfig('scrollSensitivity', val)}
            color="#f59e0b"
          />
        </div>

        {/* Performance Section */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <SectionHeader 
            icon={<Layers className="w-4 h-4 text-pink-400" />}
            title="Performance"
          />
          
          <div className="text-xs text-gray-400 mb-3">
            Active Cards: {helixConfig.activeCards || 'Auto'}
          </div>
          
          <div className="text-xs text-gray-400 mb-3">
            Render Distance: {helixConfig.renderDistance || 'Full'}
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs px-3 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => updateConfig('enableCulling', !helixConfig.enableCulling)}
            >
              {helixConfig.enableCulling ? 'Culling ON' : 'Culling OFF'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs px-3 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => updateConfig('enableLOD', !helixConfig.enableLOD)}
            >
              {helixConfig.enableLOD ? 'LOD ON' : 'LOD OFF'}
            </Button>
          </div>

          <SliderControl
            label="SHOW EVERY Nth CARD"
            value={helixConfig.showEveryNth || 1}
            min={1}
            max={10}
            step={1}
            suffix=""
            onChange={(val) => updateConfig('showEveryNth', val)}
            color="#ec4899"
          />
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-3 bg-gray-800/30 rounded border border-gray-700">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Total Projects: {helixConfig.totalProjects || 16}</div>
            <div>Total Cards: {helixConfig.visibleCards || 'All'}</div>
            <div>Showing Every: {helixConfig.showEveryNth}th card</div>
            <div>Rendered Cards: {Math.ceil((helixConfig.visibleCards || 32) / (helixConfig.showEveryNth || 1))}</div>
            <div>Current Offset: {(helixConfig.scrollOffset || 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
};