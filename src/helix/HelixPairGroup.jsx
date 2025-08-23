import React from 'react';
import HelixTile from './HelixTile.jsx';

export default function HelixPairGroup({
  thetaDeg,
  yOffset,
  radius,
  sceneYaw,
  media,
  info,
  nodeVars = {},
  className = '',
  onClick
}) {
  // base group transform (rotateY θᵢ then climb)
  const groupStyle = {
    transform: `
      translate(-50%, -50%)
      rotateY(${thetaDeg}deg)
      translateY(${yOffset}px)
    `,
  };

  // yaw cancel uses (angle + sceneYaw); for inner card we pass strings
  const cardYawA = `rotateY(${-(thetaDeg + sceneYaw)}deg)`;
  const cardYawB = `rotateY(${-(thetaDeg + 180 + sceneYaw)}deg)`;

  return (
    <div className="pair-group absolute left-1/2 top-1/2" style={groupStyle} role="group">
      {/* Strand A (+R) - Media */}
      <div className="pair-node A absolute" style={{ transform: `translateX(${radius}px)` }}>
        <HelixTile
          className={className}
          nodeStyle={nodeVars}
          dataGhost="on"
          cardYaw={cardYawA}
          media={media}
          onClick={onClick}
        />
      </div>

      {/* Connector (base pair) */}
      <div 
        className="pair-connector absolute left-1/2 top-1/2"
        aria-hidden="true"
        style={{
          width: `${radius * 2}px`,
          height: '2px',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Strand B (−R) — info card */}
      <div className="pair-node B absolute" style={{ transform: `translateX(${-radius}px)` }}>
        <HelixTile
          className={className + ' pair-info'}
          nodeStyle={nodeVars}
          dataGhost="off"
          cardYaw={cardYawB}
          media={info}
        />
      </div>
    </div>
  );
}