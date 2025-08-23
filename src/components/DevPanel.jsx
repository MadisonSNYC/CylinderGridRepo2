import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Settings, Palette, Sparkles, Box, RotateCw, Navigation, Type, Mouse } from 'lucide-react';

export const DevPanel = ({ effects, onEffectToggle, onReset, setPlacementStrength, setRepeatTurns }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const effectGroups = [
    {
      title: 'Color',
      icon: <Palette className="w-3 h-3" />,
      effects: [
        { key: 'ashfallColors', label: 'Ashfall Theme', description: 'Light cream background' },
        { key: 'monochrome', label: 'Monochrome', description: 'Grayscale cards' }
      ]
    },
    {
      title: 'Effects',
      icon: <Sparkles className="w-3 h-3" />,
      effects: [
        { key: 'chromaticAberration', label: 'Chromatic', description: 'RGB separation' },
        { key: 'depthBlur', label: 'Depth Blur', description: 'Distance blur' },
        { key: 'glitchEffects', label: 'Glitch', description: 'Hover glitch' },
        { key: 'ambientLighting', label: 'Lighting', description: 'Soft shadows' },
        { key: 'outwardTurn', label: 'Outward Turn', description: 'Scroll-based opening + ghost' },
        { key: 'rgbEdge', label: 'RGB Edge', description: 'Chromatic card edges' }
      ]
    },
    {
      title: 'Lab FX',
      icon: <Sparkles className="w-3 h-3" />,
      effects: [
        { key: 'depthOfField', label: 'DoF', description: 'Depth blur' },
        { key: 'ghostBack', label: 'Ghost', description: 'Back cards' },
        { key: 'biasEffect', label: 'Bias', description: '3D depth accent' },
        { key: 'monitorStyle', label: 'Monitor', description: 'CRT style' },
        { key: 'screenGlow', label: 'Glow', description: 'Screen glow' },
        { key: 'scanLines', label: 'Scan', description: 'TV lines' },
        { key: 'atmosphericGrain', label: 'Grain', description: 'Film grain' },
        { key: 'filmNoise', label: 'Noise', description: 'Film noise' },
        { key: 'cinematicLighting', label: 'Cinematic', description: 'Pro lighting' }
      ]
    },
    {
      title: 'Cards',
      icon: <Box className="w-3 h-3" />,
      effects: [
        { key: 'ashfallCards', label: 'Ashfall Style', description: 'Clean white cards' },
        { key: 'cardShadows', label: 'Shadows', description: 'Drop shadows' },
        { key: 'cardBorders', label: 'Borders', description: 'Card borders' }
      ]
    },
    {
      title: 'Structure',
      icon: <RotateCw className="w-3 h-3" />,
      effects: [
        { key: 'centralWireframe', label: 'Wireframe', description: 'Center structure' },
        { key: 'centerLogo', label: 'Center Logo', description: 'Ravie logo in center' },
        { key: 'smoothRotation', label: 'Smooth', description: 'Better easing' },
        { key: 'depthHierarchy', label: 'Depth', description: 'Scale by distance' }
      ],
      hasLogoMode: true,
      hasRepeatTurns: true
    },
    {
      title: 'Nav',
      icon: <Navigation className="w-3 h-3" />,
      effects: [
        { key: 'projectCounter', label: 'Counter', description: 'Project number' },
        { key: 'navigationDots', label: 'Dots', description: 'Nav indicators' },
        { key: 'minimalistControls', label: 'Controls', description: 'Clean controls' }
      ]
    },
    {
      title: 'Type',
      icon: <Type className="w-3 h-3" />,
      effects: [
        { key: 'ashfallTypography', label: 'Typography', description: 'Ashfall fonts' },
        { key: 'subtleText', label: 'Subtle', description: 'Muted colors' }
      ]
    },
    {
      title: 'Placement',
      icon: <Settings className="w-3 h-3" />,
      effects: [
        // No toggle needed - placement is always-on
      ],
      hasSlider: true
    },
    {
      title: 'Input',
      icon: <Mouse className="w-3 h-3" />,
      effects: [
        { key: 'invertScroll', label: 'Invert Scroll', description: 'Flip wheel direction' }
      ],
      hasMode: true
    }
  ];

  return (
    <div className={`fixed top-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-l border-gray-200 shadow-lg transition-transform duration-300 ${
      isCollapsed ? 'translate-x-full' : 'translate-x-0'
    }`} style={{ width: '320px', height: '100vh' }}>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-8 top-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-l-lg p-2 shadow-sm hover:bg-gray-50"
      >
        <Settings className="w-4 h-4 text-gray-600" />
      </button>

      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-800">Dev Panel</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onReset()}
              className="text-xs px-2 py-1 h-6"
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
                  onEffectToggle(key, value);
                });
              }}
              className="text-xs px-2 py-1 h-6 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              Ashfall
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {effectGroups.map((group) => (
            <div key={group.title} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {group.icon}
                <h3 className="font-medium text-gray-700 text-xs">{group.title}</h3>
              </div>
              <div className="space-y-2">
                {group.effects.map((effect) => (
                  <div key={effect.key} className="flex items-start gap-2">
                    <Switch
                      id={effect.key}
                      checked={effects[effect.key] || false}
                      onCheckedChange={(checked) => onEffectToggle(effect.key, checked)}
                      className="mt-0.5 scale-75"
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={effect.key} 
                        className="text-xs font-medium text-gray-700 cursor-pointer block"
                      >
                        {effect.label}
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                        {effect.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* RGB Edge Controls */}
              {group.title === 'Effects' && effects.rgbEdge && (
                <div className="mt-3 px-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600">RGB Intensity</label>
                      <span className="text-xs font-medium text-gray-700">{effects.rgbIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={effects.rgbIntensity}
                      onChange={(e) => onEffectToggle('rgbIntensity', Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${effects.rgbIntensity}%, #e5e7eb ${effects.rgbIntensity}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600">RGB Offset</label>
                      <span className="text-xs font-medium text-gray-700">{effects.rgbOffsetPx}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={1}
                      value={effects.rgbOffsetPx}
                      onChange={(e) => onEffectToggle('rgbOffsetPx', Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${effects.rgbOffsetPx * 50}%, #e5e7eb ${effects.rgbOffsetPx * 50}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Add mode selector for Input section */}
              {group.hasMode && group.title === 'Input' && (
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Mode</label>
                    <span className="text-xs font-medium text-gray-700">{effects.scrollMode}</span>
                  </div>
                  <select
                    value={effects.scrollMode || 'wheel'}
                    onChange={(e) => onEffectToggle('scrollMode', e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="wheel">Wheel (manual)</option>
                    <option value="sticky">Sticky (scroll timeline)</option>
                  </select>
                </div>
              )}

              {/* Add slider for Placement section - always show (placement always-on) */}
              {group.hasSlider && group.title === 'Placement' && (
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Strength</label>
                    <span className="text-xs font-medium text-gray-700">{effects.placementStrength}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={effects.placementStrength}
                    onChange={(e) => setPlacementStrength?.(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${effects.placementStrength * 10}%, #e5e7eb ${effects.placementStrength * 10}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">0</span>
                    <span className="text-xs text-gray-400">10</span>
                  </div>
                </div>
              )}

              {/* Add Logo Mode selector for Structure section */}
              {group.hasLogoMode && group.title === 'Structure' && effects.centerLogo && (
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Logo Mode</label>
                  </div>
                  <select
                    value={effects.centerLogoMode || 'billboard'}
                    onChange={(e) => onEffectToggle('centerLogoMode', e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="billboard">Billboard (always forward)</option>
                    <option value="rotate">Rotate with scene</option>
                  </select>
                </div>
              )}

              {/* Add Repeat Turns slider for Structure section */}
              {group.hasRepeatTurns && group.title === 'Structure' && (
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Repeat Turns</label>
                    <span className="text-xs font-medium text-gray-700">{effects.repeatTurns?.toFixed(1) || '2.0'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={effects.repeatTurns || 2}
                    onChange={(e) => setRepeatTurns?.(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(effects.repeatTurns || 2) * 20}%, #e5e7eb ${(effects.repeatTurns || 2) * 20}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">0</span>
                    <span className="text-xs text-gray-400">5</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Active: {Object.values(effects).filter(Boolean).length} / {Object.keys(effects).length}
          </div>
        </div>
      </div>
    </div>
  );
};

