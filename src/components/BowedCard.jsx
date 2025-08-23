import React from 'react';

/**
 * BowedCard
 *  - direction: 'convex' | 'concave' (default 'convex')
 *  - slices: vertical slices (default 9)
 *  - bowAngle: total yaw spread (deg) across the card (default 18 => ±9)
 *  - depthPx: z compensation per edge (default 6)
 */
export default function BowedCard({
  src,
  direction = 'convex',
  slices = 9,
  bowAngle = 18,
  depthPx = 6,
  className = '',
}) {
  const half = (slices - 1) / 2;
  const per  = bowAngle / (slices - 1); // deg per slice step

  const items = Array.from({ length: slices }, (_, i) => {
    const rel   = i - half;          // center -> 0, edges -> ±
    const yaw   = rel * per;         // lateral yaw
    const isEdge = i === 0 || i === slices - 1;

    // background x-position across the sprite (0..100%)
    const posX = (i / (slices - 1)) * 100;

    // z compensation:
    //  - concave (monitor): edges come FORWARD -> +translateZ
    //  - convex (projecting): edges go BACK    -> -translateZ
    const tzMag = Math.abs(rel) * (depthPx / (half || 1));
    const tz    = direction === 'concave' ? +tzMag : -tzMag;

    return (
      <div
        key={i}
        className={`bow-slice${isEdge ? ' edge' : ''}`}
        style={{
          transform: `rotateY(${yaw}deg) translateZ(${tz}px)`,
          backgroundImage: `url(${src})`,
          backgroundPosition: `${posX}% 50%`,
        }}
      />
    );
  });

  return (
    <div className={`bow ${className}`} style={{ '--bow-slices': slices }}>
      <div className="bow-slices">{items}</div>
    </div>
  );
}