import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { 
  Palette, 
  Sparkles, 
  Box, 
  RotateCw, 
  Navigation, 
  Type, 
  Mouse,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Settings,
  Undo2,
  Redo2
} from 'lucide-react';

export const EffectsControlPanel = ({ effects, onEffectToggle, onReset, onUndo, onRedo, canUndo, canRedo, setPlacementStrength, setRepeatTurns, lockedEffects = {}, onToggleLock }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hiddenGroups, setHiddenGroups] = useState({});

  const toggleGroupVisibility = (groupTitle) => {
    setHiddenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const effectGroups = [
    {
      title: 'Color Schemes',
      icon: <Palette className="w-4 h-4" />,
      color: 'text-pink-400',
      borderColor: 'border-pink-500/30',
      bgColor: 'bg-pink-900/20',
      effects: [
        { key: 'ashfallColors', label: 'Ashfall Theme', description: 'Light cream background' },
        { key: 'monochrome', label: 'Monochrome', description: 'Grayscale cards' }
      ]
    },
    {
      title: 'Visual Effects',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-900/20',
      effects: [
        { key: 'chromaticAberration', label: 'Chromatic', description: 'RGB separation' },
        { key: 'depthBlur', label: 'Depth Blur', description: 'Distance blur' },
        { key: 'glitchEffects', label: 'Glitch', description: 'Hover glitch' },
        { key: 'ambientLighting', label: 'Lighting', description: 'Soft shadows' },
        { key: 'rgbEdge', label: 'RGB Edge', description: 'Chromatic card edges' }
      ]
    },
    {
      title: 'Card Design',
      icon: <Box className="w-4 h-4" />,
      color: 'text-green-400',
      borderColor: 'border-green-500/30',
      bgColor: 'bg-green-900/20',
      effects: [
        { key: 'ashfallCards', label: 'Ashfall Style', description: 'Clean white cards' },
        { key: 'cardShadows', label: 'Shadows', description: 'Drop shadows' },
        { key: 'cardBorders', label: 'Borders', description: 'Card borders' },
        { key: 'richCardContent', label: 'Rich Content', description: 'Show videos/images on cards' },
        { key: 'cardHoverEffects', label: 'Hover Effects', description: 'Interactive card animations' },
        { key: 'videoPlayOnHover', label: 'Video Hover', description: 'Play videos on hover' }
      ]
    },
    {
      title: 'Structure & Motion',
      icon: <RotateCw className="w-4 h-4" />,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-900/20',
      effects: [
        { key: 'centralWireframe', label: 'Wireframe', description: 'Center structure' },
        { key: 'centerLogo', label: 'Center Logo', description: 'Ravie logo in center' },
        { key: 'smoothRotation', label: 'Smooth', description: 'Better easing' },
        { key: 'depthHierarchy', label: 'Depth', description: 'Scale by distance' },
        { key: 'organicFlow', label: 'Organic Flow', description: 'Natural variations' },
        { key: 'outwardTurn', label: 'Outward Turn', description: 'Scroll-based opening + ghost' }
      ],
      hasLogoMode: true,
      hasRepeatTurns: true
    },
    {
      title: 'Navigation',
      icon: <Navigation className="w-4 h-4" />,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
      bgColor: 'bg-yellow-900/20',
      effects: [
        { key: 'projectCounter', label: 'Counter', description: 'Project number' },
        { key: 'navigationDots', label: 'Dots', description: 'Nav indicators' },
        { key: 'minimalistControls', label: 'Controls', description: 'Clean controls' }
      ]
    },
    {
      title: 'Typography',
      icon: <Type className="w-4 h-4" />,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      bgColor: 'bg-indigo-900/20',
      effects: [
        { key: 'ashfallTypography', label: 'Typography', description: 'Ashfall fonts' },
        { key: 'subtleText', label: 'Subtle', description: 'Muted colors' }
      ]
    },
    {
      title: 'Placement System',
      icon: <Settings className="w-4 h-4" />,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-900/20',
      effects: [],
      hasSlider: true
    },
    {
      title: 'Input Controls',
      icon: <Mouse className="w-4 h-4" />,
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-900/20',
      effects: [
        { key: 'invertScroll', label: 'Invert Scroll', description: 'Flip wheel direction' }
      ],
      hasMode: true
    }
  ];

  const EffectControl = ({ effect, isLocked, onToggle, onToggleLock }) => (
    <div className={`flex items-start gap-3 p-2 rounded-lg transition-all ${isLocked ? 'bg-gray-800/60 border border-gray-600' : 'hover:bg-gray-800/30'}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Switch
          id={effect.key}
          checked={effects[effect.key] || false}
          onCheckedChange={(checked) => !isLocked && onToggle(effect.key, checked)}
          className={`scale-75 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLocked}
        />
        <div className="flex-1 min-w-0">
          <label 
            htmlFor={effect.key} 
            className={`text-xs font-medium cursor-pointer block ${isLocked ? 'text-gray-400' : 'text-gray-200 hover:text-white'}`}
          >
            {effect.label}
          </label>
          <p className="text-xs text-gray-500 mt-0.5 leading-tight">
            {effect.description}
          </p>
        </div>
      </div>
      <button
        onClick={() => onToggleLock?.(effect.key)}
        className={`p-1 rounded transition-colors ${
          isLocked 
            ? 'text-red-400 hover:text-red-300 bg-red-900/20' 
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
        }`}
        title={isLocked ? 'Unlock effect' : 'Lock effect'}
      >
        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
      </button>
    </div>
  );

  const GroupHeader = ({ group, isHidden, onToggleVisibility }) => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={group.color}>
          {group.icon}
        </div>
        <h3 className={`font-semibold text-sm uppercase tracking-wide ${group.color}`}>
          {group.title}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          {group.effects?.filter(e => effects[e.key]).length || 0}/{group.effects?.length || 0}
        </span>
        <button
          onClick={onToggleVisibility}
          className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors"
          title={isHidden ? 'Show group' : 'Hide group'}
        >
          {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );

  const SliderControl = ({ label, value, min, max, step = 1, suffix = '', onChange, isLocked, onToggleLock }) => (
    <div className={`p-2 rounded-lg transition-all ${isLocked ? 'bg-gray-800/60 border border-gray-600' : 'hover:bg-gray-800/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <label className={`text-xs font-medium ${isLocked ? 'text-gray-400' : 'text-gray-300'}`}>{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-400">{value}{suffix}</span>
          <button
            onClick={() => onToggleLock?.(`slider-${label.toLowerCase().replace(/\s+/g, '-')}`)}
            className={`p-1 rounded transition-colors ${
              isLocked 
                ? 'text-red-400 hover:text-red-300 bg-red-900/20' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
            }`}
            title={isLocked ? 'Unlock slider' : 'Lock slider'}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => !isLocked && onChange(Number(e.target.value))}
        disabled={isLocked}
        className={`w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
        }}
      />
    </div>
  );

  return (
    <div className={`fixed top-0 left-0 z-50 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 shadow-2xl transition-transform duration-300 ${
      isCollapsed ? '-translate-x-full' : 'translate-x-0'
    }`} style={{ width: '380px', height: '100vh' }}>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-12 top-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-r-lg p-2 shadow-sm hover:bg-gray-800 transition-colors z-10"
      >
        <Sparkles className="w-4 h-4 text-purple-400" />
      </button>

      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">EFFECTS CONTROL</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onUndo}
              disabled={!canUndo}
              className="text-xs px-1.5 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo last change (Ctrl+Z)"
            >
              <Undo2 className="w-3 h-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRedo}
              disabled={!canRedo}
              className="text-xs px-1.5 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo last undone change (Ctrl+Y)"
            >
              <Redo2 className="w-3 h-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onReset?.()}
              className="text-xs px-2 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const ashfallPreset = {
                  ashfallColors: true,
                  monochrome: true,
                  chromaticAberration: true,
                  depthBlur: true,
                  ashfallCards: true,
                  cardShadows: true,
                  centralWireframe: true,
                  smoothRotation: true,
                  depthHierarchy: true,
                  projectCounter: true,
                  ashfallTypography: true,
                  subtleText: true,
                  outwardTurn: true
                };
                Object.entries(ashfallPreset).forEach(([key, value]) => {
                  if (!lockedEffects[key]) {
                    onEffectToggle?.(key, value);
                  }
                });
              }}
              className="text-xs px-2 py-1 h-6 bg-blue-50/10 text-blue-400 border-blue-500/30 hover:bg-blue-50/20"
            >
              Ashfall
            </Button>
          </div>
        </div>

        {/* Lock Status Summary */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Locked Effects:</span>
            <span className="text-red-400 font-mono">{Object.values(lockedEffects).filter(Boolean).length}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-400">Active Effects:</span>
            <span className="text-green-400 font-mono">{Object.values(effects).filter(Boolean).length}</span>
          </div>
        </div>

        {/* Effect Groups */}
        <div className="space-y-4">
          {effectGroups.map((group) => {
            const isGroupHidden = hiddenGroups[group.title];
            return (
              <div 
                key={group.title} 
                className={`p-4 rounded-lg border transition-all ${group.bgColor} ${group.borderColor}`}
              >
                <GroupHeader 
                  group={group}
                  isHidden={isGroupHidden}
                  onToggleVisibility={() => toggleGroupVisibility(group.title)}
                />
                
                {!isGroupHidden && (
                  <>
                    {/* Effects List */}
                    <div className="space-y-2">
                      {group.effects?.map((effect) => (
                        <EffectControl
                          key={effect.key}
                          effect={effect}
                          isLocked={lockedEffects[effect.key]}
                          onToggle={onEffectToggle}
                          onToggleLock={onToggleLock}
                        />
                      ))}
                    </div>
                    
                    {/* Group-specific Controls */}
                    {group.hasMode && group.title === 'Input Controls' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-gray-300">Scroll Mode</label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400">{effects.scrollMode || 'wheel'}</span>
                            <button
                              onClick={() => onToggleLock?.('scrollMode')}
                              className={`p-1 rounded transition-colors ${
                                lockedEffects.scrollMode 
                                  ? 'text-red-400 hover:text-red-300 bg-red-900/20' 
                                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                              }`}
                            >
                              {lockedEffects.scrollMode ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <select
                          value={effects.scrollMode || 'wheel'}
                          onChange={(e) => !lockedEffects.scrollMode && onEffectToggle?.('scrollMode', e.target.value)}
                          disabled={lockedEffects.scrollMode}
                          className={`w-full text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 ${lockedEffects.scrollMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="wheel">Wheel (manual)</option>
                          <option value="sticky">Sticky (scroll timeline)</option>
                        </select>
                      </div>
                    )}

                    {group.hasSlider && group.title === 'Placement System' && (
                      <div className="mt-3">
                        <SliderControl
                          label="STRENGTH"
                          value={effects.placementStrength || 6}
                          min={0}
                          max={10}
                          step={1}
                          onChange={setPlacementStrength}
                          isLocked={lockedEffects['slider-strength']}
                          onToggleLock={onToggleLock}
                        />
                      </div>
                    )}

                    {group.hasLogoMode && group.title === 'Structure & Motion' && effects.centerLogo && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-gray-300">Logo Mode</label>
                          <button
                            onClick={() => onToggleLock?.('centerLogoMode')}
                            className={`p-1 rounded transition-colors ${
                              lockedEffects.centerLogoMode 
                                ? 'text-red-400 hover:text-red-300 bg-red-900/20' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {lockedEffects.centerLogoMode ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>
                        </div>
                        <select
                          value={effects.centerLogoMode || 'billboard'}
                          onChange={(e) => !lockedEffects.centerLogoMode && onEffectToggle?.('centerLogoMode', e.target.value)}
                          disabled={lockedEffects.centerLogoMode}
                          className={`w-full text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 ${lockedEffects.centerLogoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="billboard">Billboard (always forward)</option>
                          <option value="rotate">Rotate with scene</option>
                        </select>
                      </div>
                    )}

                    {group.hasRepeatTurns && group.title === 'Structure & Motion' && (
                      <div className="mt-3">
                        <SliderControl
                          label="REPEAT TURNS"
                          value={effects.repeatTurns || 2}
                          min={0}
                          max={5}
                          step={0.5}
                          onChange={setRepeatTurns}
                          isLocked={lockedEffects['slider-repeat-turns']}
                          onToggleLock={onToggleLock}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
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
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        .slider:disabled::-webkit-slider-thumb {
          background: #6b7280;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};