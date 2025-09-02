import React, { useCallback, useMemo } from 'react';

/**
 * Core helix geometry calculations
 */
export const calculateHelixPosition = (index, total, scrollOffset = 0, config = {}) => {
  const {
    radius = 320,
    verticalSpacing = 100,
    rotationSpeed = 1
  } = config;
  
  const angle = (index / total) * 360;
  const rotationOffset = scrollOffset * 360 * rotationSpeed;
  const currentAngle = angle + rotationOffset;
  const radians = (currentAngle * Math.PI) / 180;
  const yOffset = (index / total) * verticalSpacing * total - (total * verticalSpacing) / 2;
  
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;
  const isFront = normalizedAngle < 60 || normalizedAngle > 300;
  const opacity = isFront ? 1 : 0.3 + (Math.cos(radians) + 1) * 0.35;
  
  return {
    transform: `
      rotateY(${currentAngle}deg)
      translateZ(${radius}px)
      translateY(${yOffset}px)
    `,
    opacity,
    angle: currentAngle,
    normalizedAngle,
    isFront,
    radians,
    x: Math.sin(radians) * radius,
    z: Math.cos(radians) * radius,
    y: yOffset
  };
};

/**
 * Minimal helix item component
 */
const HelixItem = React.memo(({
  children,
  index,
  total,
  scrollOffset,
  config,
  onClick,
  className = '',
  style = {}
}) => {
  const position = useMemo(
    () => calculateHelixPosition(index, total, scrollOffset, config),
    [index, total, scrollOffset, config]
  );
  
  const handleClick = useCallback(() => {
    onClick?.(index);
  }, [onClick, index]);
  
  return (
    <div
      className={`helix-item ${className}`}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: position.transform,
        transformStyle: 'preserve-3d',
        opacity: position.opacity,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onClick={handleClick}
      data-index={index}
      data-front={position.isFront}
    >
      {typeof children === 'function' ? children(position) : children}
    </div>
  );
});

/**
 * Core helix container component
 */
export const HelixCore = ({
  items = [],
  scrollOffset = 0,
  config = {},
  onItemClick,
  renderItem,
  className = '',
  style = {},
  containerProps = {}
}) => {
  const {
    perspective = 1200,
    perspectiveOrigin = '50% 50%',
    rotateX = -10,
    ...itemConfig
  } = config;
  
  return (
    <div
      className={`helix-core ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: `${perspective}px`,
        perspectiveOrigin,
        ...style
      }}
      {...containerProps}
    >
      <div
        className="helix-assembly"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transformStyle: 'preserve-3d',
          transform: `translateX(-50%) translateY(-50%) rotateX(${rotateX}deg)`
        }}
      >
        {items.map((item, index) => (
          <HelixItem
            key={item.id || index}
            index={index}
            total={items.length}
            scrollOffset={scrollOffset}
            config={itemConfig}
            onClick={onItemClick}
          >
            {renderItem ? renderItem(item, index) : item}
          </HelixItem>
        ))}
      </div>
    </div>
  );
};

export default HelixCore;