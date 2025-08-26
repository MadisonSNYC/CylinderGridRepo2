import React, { useEffect, useRef, useState } from 'react';

export const AspectRatioTest = ({ enabled = false }) => {
  const [cardMeasurements, setCardMeasurements] = useState([]);
  const measurementRef = useRef();

  useEffect(() => {
    if (!enabled) return;

    const measureCards = () => {
      const cards = document.querySelectorAll('.helix-node:not([data-orb-index])');
      const measurements = [];
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(card);
        const actualRatio = rect.width / rect.height;
        const expectedRatio = 9 / 16;
        const isCorrectRatio = Math.abs(actualRatio - expectedRatio) < 0.01;
        
        measurements.push({
          index,
          width: rect.width.toFixed(1),
          height: rect.height.toFixed(1),
          actualRatio: actualRatio.toFixed(4),
          expectedRatio: expectedRatio.toFixed(4),
          isCorrect: isCorrectRatio,
          transform: computedStyle.transform,
          element: card
        });
      });
      
      setCardMeasurements(measurements);
    };

    // Measure initially and on resize/scroll
    measureCards();
    const interval = setInterval(measureCards, 1000);
    
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg max-h-96 overflow-y-auto z-50 text-xs">
      <h3 className="text-sm font-bold mb-2">Aspect Ratio Test Results</h3>
      <p className="mb-2">Expected ratio: 0.5625 (9:16)</p>
      
      <div className="space-y-1">
        {cardMeasurements.slice(0, 10).map((measurement, i) => (
          <div 
            key={i}
            className={`p-2 rounded ${measurement.isCorrect ? 'bg-green-800' : 'bg-red-800'}`}
          >
            <div>Card {measurement.index}: {measurement.width}×{measurement.height}</div>
            <div>Ratio: {measurement.actualRatio} {measurement.isCorrect ? '✓' : '✗'}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-600">
        <div className="text-green-400">
          Correct: {cardMeasurements.filter(m => m.isCorrect).length}
        </div>
        <div className="text-red-400">
          Incorrect: {cardMeasurements.filter(m => !m.isCorrect).length}
        </div>
      </div>
      
      {/* Visual overlay on cards */}
      {cardMeasurements.map((measurement, i) => (
        <div
          key={`overlay-${i}`}
          className="fixed pointer-events-none z-40"
          style={{
            left: measurement.element?.getBoundingClientRect().left,
            top: measurement.element?.getBoundingClientRect().top,
            width: measurement.element?.getBoundingClientRect().width,
            height: measurement.element?.getBoundingClientRect().height,
            border: `2px solid ${measurement.isCorrect ? 'green' : 'red'}`,
            background: measurement.isCorrect ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)'
          }}
        >
          <div className="absolute top-0 left-0 bg-black text-white text-xs px-1">
            {measurement.actualRatio}
          </div>
        </div>
      ))}
    </div>
  );
};