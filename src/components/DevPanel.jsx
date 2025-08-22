import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Settings, Palette, Sparkles, Box, RotateCw, Navigation, Type } from 'lucide-react';

export const DevPanel = ({ effects, onEffectToggle, onReset }) => {
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
        { key: 'ambientLighting', label: 'Lighting', description: 'Soft shadows' }
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
        { key: 'smoothRotation', label: 'Smooth', description: 'Better easing' },
        { key: 'depthHierarchy', label: 'Depth', description: 'Scale by distance' }
      ]
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
                  subtleText: true
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
          {effectGroups.map((group, groupIndex) => (
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

