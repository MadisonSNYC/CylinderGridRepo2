# Helix Component Export Instructions

## Overview
This document provides complete instructions for integrating the Simplified Helix component into a new project. The component includes all visual effects by default: cinematic color grading, ghost card backs, depth of field, motion blur, auto-rotation, and monitor bezel effects.

## Files to Copy

### Required Files
1. **`helix-simplified.html`** - Complete self-contained helix component
2. **Video Assets** (copy to `public/` folder in new project):
   - `1-22-2022_Vertical.mp4`
   - `2-12-22_Looping.mp4`
   - `3-11-22.mp4`

## Integration Methods

### Method 1: Standalone HTML (Recommended - Most Reliable)

**Why This Method:**
- Zero dependencies or build tools required
- Works universally across all platforms
- No framework version conflicts
- Immediate functionality

**Setup Steps:**
```bash
# In your new project directory
mkdir public
cp helix-simplified.html ./
cp 1-22-2022_Vertical.mp4 ./public/
cp 2-12-22_Looping.mp4 ./public/
cp 3-11-22.mp4 ./public/
```

**Launch:**
```bash
# Start any HTTP server
python3 -m http.server 8000
# OR
npx http-server
# OR 
npm run dev (if using Vite/similar)

# Open: http://localhost:8000/helix-simplified.html
```

### Method 2: Framework Integration

If you need to integrate into React/Vue/etc:

**Extract JavaScript Class:**
```javascript
// components/HelixComponent.js
export class SimplifiedHelix {
  // Copy the entire SimplifiedHelix class from helix-simplified.html
  // (Lines ~400-670 in the HTML file)
}
```

**Extract CSS:**
```css
/* components/HelixComponent.css */
/* Copy all styles from the <style> block in helix-simplified.html */
```

**React Example:**
```jsx
import { useEffect, useRef } from 'react';
import { SimplifiedHelix } from './HelixComponent.js';
import './HelixComponent.css';

export function HelixComponent() {
  const containerRef = useRef();

  useEffect(() => {
    const helix = new SimplifiedHelix(containerRef.current);
    return () => helix.destroy?.(); // cleanup if implemented
  }, []);

  return <div ref={containerRef} id="helix-container" />;
}
```

## Component Features

### Default Visual Effects (All Enabled)
- **Cinematic Color Grading** - Warm/cool film-like color shifts
- **Ghost Card Backs** - Subtle translucent shadows behind cards
- **Depth of Field** - Distance-based blur for 3D depth perception
- **Motion Blur** - Smooth blur during scroll interactions
- **Auto-Rotation** - Continuous gentle spinning when idle
- **Monitor Bezel** - 3D frame effect around viewport
- **Inertia Scrolling** - Physics-based momentum scrolling

### Content Providers
The component supports two content sources:

1. **Local Content** (default) - Uses the 3 video files
2. **Contentful CMS** - Can be configured for dynamic content

### Configuration Options
```javascript
// Default tight helix configuration
const config = {
  placementMode: 'tight',    // Compact helix layout
  everyNth: 2,              // Show full card every 2nd position
  provider: 'local',        // Use local video files
  effects: {
    minimal: true,          // Clean card styling
    hover: true            // Interactive hover effects
  }
}
```

## Customization

### Change Content
Replace video files in `/public/` folder with your content. Supported formats: MP4, WebM.

### Adjust Effects
All effects are in the CSS within `helix-simplified.html`. Search for:
- `.color-grading-overlay` - Color grading intensity
- `.card-cinematic-overlay` - Card film effects  
- `.helix-card::before` - Ghost shadows
- `--depth-blur` - Depth of field blur amount
- Auto-rotation speed in JavaScript (search for `0.0008`)

### Layout Options
The component includes different placement modes:
- `tight` - Compact helix (current default)
- `helix` - Standard helix layout
- `cylinder` - Perfect cylinder
- `spiral` - Wider spiral pattern

## Troubleshooting

### Videos Not Playing
- Ensure video files are in `/public/` folder
- Check browser autoplay policies
- Verify HTTP server is serving static files correctly

### Performance Issues
- Reduce auto-rotation speed (decrease `0.0008` value)
- Lower depth blur range in `createCard` method
- Disable some effects if needed

### CSS Conflicts
The component uses unique class names (`helix-*`) to avoid conflicts, but check for:
- Global CSS affecting transforms
- Z-index conflicts
- Viewport/overflow CSS interference

## Server Requirements
- Any HTTP server that can serve static files
- No special backend requirements
- Works with: Apache, Nginx, Node.js, Python, Vite, etc.

## Browser Support
- Modern browsers with CSS 3D transform support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

## File Structure Example
```
your-project/
├── helix-simplified.html
├── public/
│   ├── 1-22-2022_Vertical.mp4
│   ├── 2-12-22_Looping.mp4
│   └── 3-11-22.mp4
├── package.json (if using npm)
└── README.md
```

## Notes
- The component is fully self-contained in `helix-simplified.html`
- All effects are optimized and enabled by default
- Logo positioning is fixed and won't interfere with the helix
- Component maintains performance with 60fps animations
- Inertia scrolling provides smooth user interactions

For additional customization or framework-specific integration help, refer to the component source code in `helix-simplified.html`.