import React from 'react';

export default function HelixTile({
  className = '',
  nodeStyle,
  dataGhost,
  cardYaw,
  media,
  overlay,
  ghost,
  onClick
}) {
  return (
    <div
      className={`helix-node helix-tile absolute cursor-pointer z-10 ${className}`}
      style={nodeStyle}
      data-ghost={dataGhost}
      onClick={onClick}
    >
      <div 
        className="tile-card w-full h-full bg-gray-700 border border-gray-500 hover:border-gray-400 transition-colors"
        style={{ 
          transform: cardYaw,
          transformStyle: 'preserve-3d', 
          backfaceVisibility: 'hidden', 
          WebkitBackfaceVisibility: 'hidden',
          transition: 'all 0.3s ease',
          borderRadius: '12px',
          visibility: 'visible'
        }}
      >
        <div className="tile-content flex items-center justify-center relative">
          {media}
          {ghost /* rarely needed if pseudo is on .helix-tile */}
          {overlay && <div className="ui-layer">{overlay}</div>}
        </div>
      </div>
    </div>
  );
}