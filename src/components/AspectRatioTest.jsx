import React, { useEffect, useRef, useState } from 'react';
import { Copy, Download } from 'lucide-react';

export const AspectRatioTest = ({ enabled = false }) => {
  const [cardMeasurements, setCardMeasurements] = useState([]);
  const [copied, setCopied] = useState(false);
  const measurementRef = useRef();

  useEffect(() => {
    if (!enabled) return;

    const measureCards = () => {
      const cards = document.querySelectorAll('.helix-node:not([data-orb-index])');
      const orbCards = document.querySelectorAll('.helix-node[data-orb-index]');
      const measurements = [];
      let skippedOrbs = 0;
      let totalCards = cards.length;
      let validCards = 0;
      
      console.log(`🔍 DIAGNOSTIC: Found ${totalCards} full cards, ${orbCards.length} orbs`);
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(card);
        
        // COMPREHENSIVE DIAGNOSTIC DATA for ALL cards
        const transform = computedStyle.transform;
        const hasOrbIndex = card.hasAttribute('data-orb-index');
        const innerHTML = card.innerHTML.substring(0, 100);
        const computedWidth = computedStyle.width;
        const computedHeight = computedStyle.height;
        const actualRatio = rect.width / rect.height;
        
        console.log(`🔍 CARD ${index} ANALYSIS:`, {
          dimensions: `${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`,
          computedCSS: `${computedWidth} × ${computedHeight}`,
          actualRatio: actualRatio.toFixed(4),
          expectedRatio: (9/16).toFixed(4),
          isCorrect: Math.abs(actualRatio - 9/16) < 0.01,
          hasOrbIndex: hasOrbIndex,
          transform: transform,
          classList: Array.from(card.classList).join(' '),
          innerHTML: innerHTML.replace(/\s+/g, ' ')
        });
        
        // SKIP ORBS: Only measure full-sized cards (not 15px orbs)  
        if (rect.width <= 20 || rect.height <= 20) {
          skippedOrbs++;
          console.log(`⚪ SKIPPED ORB ${index}: ${rect.width}×${rect.height}px`);
          return; // Skip tiny orb cards
        }
        
        validCards++;
        const expectedRatio = 9 / 16;
        const isCorrectRatio = Math.abs(actualRatio - expectedRatio) < 0.01;
        
        // Get card position data from transform or data attributes  
        const transformMatrix = new DOMMatrix(transform);
        const rotationY = Math.atan2(transformMatrix.m13, transformMatrix.m33) * (180 / Math.PI);
        const translationZ = transformMatrix.m43;
        
        // Calculate normalized angle (approximate)
        const normalizedAngle = ((rotationY + 180) % 360);
        const isFrontFacing = normalizedAngle < 45 || normalizedAngle > 315;
        const isNearFront = normalizedAngle < 90 || normalizedAngle > 270;
        const placement = isFrontFacing ? 'Front' : isNearFront ? 'Near-Front' : normalizedAngle < 180 ? 'Right-Side' : 'Left-Side';
        
        measurements.push({
          index,
          width: rect.width.toFixed(1),
          height: rect.height.toFixed(1),
          actualRatio: actualRatio.toFixed(4),
          expectedRatio: expectedRatio.toFixed(4),
          isCorrect: isCorrectRatio,
          transform,
          element: card,
          // Position data
          rotationY: rotationY.toFixed(1),
          normalizedAngle: normalizedAngle.toFixed(1),
          translationZ: translationZ.toFixed(1),
          placement,
          isFrontFacing,
          isNearFront,
          // Error metrics
          ratioError: Math.abs(actualRatio - expectedRatio).toFixed(4),
          ratioErrorPercent: (Math.abs(actualRatio - expectedRatio) / expectedRatio * 100).toFixed(1)
        });
      });
      
      // DIAGNOSTIC SUMMARY & PATTERN ANALYSIS
      const correctCount = measurements.filter(m => m.isCorrect).length;
      const successRate = validCards > 0 ? (correctCount / validCards * 100).toFixed(1) : 0;
      
      // PATTERN ANALYSIS - Find patterns in failing cards
      const failingCards = measurements.filter(m => !m.isCorrect);
      const passingCards = measurements.filter(m => m.isCorrect);
      
      console.log(`📊 MEASUREMENT SUMMARY:`);
      console.log(`  Total DOM cards: ${totalCards}`);
      console.log(`  Orbs found: ${orbCards.length}`);
      console.log(`  Skipped orbs: ${skippedOrbs}`);
      console.log(`  Valid measured cards: ${validCards}`);
      console.log(`  Correct ratios: ${correctCount}/${validCards} (${successRate}%)`);
      
      console.log(`🔍 PATTERN ANALYSIS:`);
      console.log(`  Failing card ratios:`, failingCards.map(c => c.actualRatio).join(', '));
      console.log(`  Passing card ratios:`, passingCards.map(c => c.actualRatio).join(', '));
      console.log(`  Every other pattern?:`, failingCards.map(c => c.index % 2).join(', '));
      console.log(`  Position patterns:`, failingCards.map(c => c.placement).join(', '));
      
      setCardMeasurements(measurements);
    };

    // Measure initially and on resize/scroll
    measureCards();
    const interval = setInterval(measureCards, 1000);
    
    return () => clearInterval(interval);
  }, [enabled]);

  const generateReport = () => {
    const summary = {
      timestamp: new Date().toISOString(),
      expected_ratio: '0.5625 (9:16)',
      total_cards: cardMeasurements.length,
      correct_ratios: cardMeasurements.filter(m => m.isCorrect).length,
      incorrect_ratios: cardMeasurements.filter(m => !m.isCorrect).length,
      front_facing_cards: cardMeasurements.filter(m => m.isFrontFacing).length,
      front_facing_correct: cardMeasurements.filter(m => m.isFrontFacing && m.isCorrect).length,
      average_error: (cardMeasurements.reduce((sum, m) => sum + parseFloat(m.ratioError), 0) / cardMeasurements.length).toFixed(4),
      worst_error: Math.max(...cardMeasurements.map(m => parseFloat(m.ratioError))).toFixed(4)
    };
    
    return {
      summary,
      detailed_measurements: cardMeasurements.map(m => ({
        card_index: m.index,
        dimensions: `${m.width}×${m.height}`,
        actual_ratio: m.actualRatio,
        ratio_error: m.ratioError,
        error_percent: m.ratioErrorPercent + '%',
        placement: m.placement,
        rotation_y: m.rotationY + '°',
        normalized_angle: m.normalizedAngle + '°',
        translation_z: m.translationZ + 'px',
        is_correct: m.isCorrect,
        is_front_facing: m.isFrontFacing
      }))
    };
  };
  
  const copyReport = () => {
    const report = generateReport();
    
    // Create a terminal-friendly plain text format
    const reportText = `Aspect Ratio Test Report - ${report.summary.timestamp}
=================================================

SUMMARY:
- Expected Ratio: ${report.summary.expected_ratio}
- Total Cards: ${report.summary.total_cards}
- Correct Ratios: ${report.summary.correct_ratios}
- Incorrect Ratios: ${report.summary.incorrect_ratios}
- Front Facing Cards: ${report.summary.front_facing_cards}
- Front Facing Correct: ${report.summary.front_facing_correct}
- Average Error: ${report.summary.average_error}
- Worst Error: ${report.summary.worst_error}

DETAILED MEASUREMENTS:
${report.detailed_measurements.map(m => 
  `Card ${m.card_index}: ${m.dimensions} | Ratio: ${m.actual_ratio} | Error: ${m.error_percent} | ${m.placement} | ${m.is_correct ? 'PASS' : 'FAIL'}`
).join('\n')}

TEST RESULTS: ${report.summary.correct_ratios}/${report.summary.total_cards} cards passed (${((report.summary.correct_ratios / report.summary.total_cards) * 100).toFixed(1)}%)
FRONT CARDS: ${report.summary.front_facing_correct}/${report.summary.front_facing_cards} front-facing cards passed (${report.summary.front_facing_cards > 0 ? ((report.summary.front_facing_correct / report.summary.front_facing_cards) * 100).toFixed(1) : 0}%)`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const downloadReport = () => {
    const report = generateReport();
    const reportText = JSON.stringify(report, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aspect-ratio-test-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!enabled) return null;

  const frontCards = cardMeasurements.filter(m => m.isFrontFacing);
  const correctFrontCards = frontCards.filter(m => m.isCorrect);

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg max-h-96 overflow-y-auto z-50 text-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold">Aspect Ratio Test Results</h3>
        <div className="flex gap-1">
          <button
            onClick={copyReport}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Copy Report"
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </button>
          <button
            onClick={downloadReport}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Download Report"
          >
            <Download className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>
      
      {copied && (
        <div className="mb-2 text-green-400 text-xs">✓ Report copied to clipboard!</div>
      )}
      
      <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>Expected: <span className="text-blue-300">0.5625 (9:16)</span></div>
          <div>Measured Cards: <span className="text-white">{cardMeasurements.length}</span></div>
          <div>Front Cards: <span className="text-yellow-300">{frontCards.length}</span></div>
          <div>Front Correct: <span className={correctFrontCards.length > 0 ? 'text-green-300' : 'text-red-300'}>{correctFrontCards.length}/{frontCards.length}</span></div>
          <div>Success Rate: <span className="text-cyan-300">{cardMeasurements.length > 0 ? ((cardMeasurements.filter(m => m.isCorrect).length / cardMeasurements.length) * 100).toFixed(1) : 0}%</span></div>
        </div>
      </div>
      
      <div className="space-y-1">
        {cardMeasurements.slice(0, 10).map((measurement, i) => {
          const bgColor = measurement.isCorrect ? 'bg-green-800' : 
                         measurement.isFrontFacing ? 'bg-red-900' : 'bg-red-800';
          return (
            <div 
              key={i}
              className={`p-2 rounded ${bgColor}`}
            >
              <div className="flex justify-between items-center">
                <span>Card {measurement.index} ({measurement.placement})</span>
                <span className="text-xs">{measurement.normalizedAngle}°</span>
              </div>
              <div className="text-xs opacity-75">{measurement.width}×{measurement.height}</div>
              <div className="flex justify-between">
                <span>Ratio: {measurement.actualRatio} {measurement.isCorrect ? '✓' : '✗'}</span>
                <span className="text-xs">Error: {measurement.ratioErrorPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-600 space-y-1">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-green-400">✓ Correct: {cardMeasurements.filter(m => m.isCorrect).length}</div>
          <div className="text-red-400">✗ Incorrect: {cardMeasurements.filter(m => !m.isCorrect).length}</div>
          <div className="text-yellow-400">Front: {frontCards.length}</div>
          <div className="text-orange-400">Avg Error: {cardMeasurements.length > 0 ? (cardMeasurements.reduce((sum, m) => sum + parseFloat(m.ratioError), 0) / cardMeasurements.length * 100).toFixed(1) : 0}%</div>
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