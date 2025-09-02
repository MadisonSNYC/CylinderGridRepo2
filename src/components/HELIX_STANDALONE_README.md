# Helix Standalone Component

A fully self-contained 3D helix carousel component with cinematic effects, ready to export to any React project.

## Features

✅ **Completely Standalone** - No external dependencies except React  
✅ **Every 3rd Card Pattern** - Full cards on every 3rd position, orbs in between  
✅ **Built-in Effects**:
- 🎬 Cinematic vignette and film grain
- 🌈 RGB edge glow on cards  
- 📺 Monitor/CRT frame effect
- 👻 Ghost reflection backs
- ✨ Animated scanlines
- 💡 Dynamic lighting system
- 🔄 Rotating center logo

## Quick Start

1. Copy `HelixStandalone.jsx` to your project
2. Import and use:

```jsx
import HelixStandalone from './components/HelixStandalone';

function App() {
  const items = [
    { 
      id: 1, 
      title: 'Project 1',
      thumbnail: '/image1.jpg',
      videoAsset: '/video1.mp4' // optional
    },
    // ... more items
  ];

  return (
    <HelixStandalone 
      items={items}
      logoSrc="/your-logo.png"
      onItemClick={(item, index) => console.log('Clicked:', item)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | Built-in demo items | Array of items to display |
| `logoSrc` | String | '/Ravielogo1.png' | Path to center logo image |
| `onItemClick` | Function | undefined | Callback when item is clicked |
| `className` | String | '' | Additional CSS class |

## Item Object Structure

```js
{
  id: 1,                    // Unique identifier
  title: 'Project Name',    // Display title
  description: 'Info',      // Optional description
  thumbnail: '/thumb.jpg',  // Image for cards
  videoAsset: '/video.mp4', // Video (plays on active)
  color: '#00ffff',        // Orb color
  icon: '🚀'              // Icon for non-media cards
}
```

## Interaction

- **Scroll** - Rotate the helix with mouse wheel
- **Arrow Keys** - Navigate with keyboard (↑↓←→)
- **Click** - Select items
- **Auto-play** - Videos play when card is active

## Customization

The component uses inline styles for complete portability. To customize:

1. **Colors**: Modify the gradient and glow colors in the component
2. **Sizes**: Adjust `radius` (320px) and `verticalSpacing` (100px)
3. **Effects**: Toggle effect sections in the render method
4. **Pattern**: Change `i % 3 === 0` to adjust card frequency

## Export to Another Project

1. Copy the entire `HelixStandalone.jsx` file
2. Ensure your project has React 16.8+ (for hooks)
3. Import and use - no additional setup needed!

## Performance

- Memoized components prevent unnecessary re-renders
- Videos only play when active
- CSS animations use GPU acceleration
- Optimized for 60fps scrolling

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Full support)
- ⚠️ IE11 (Not supported - requires 3D transforms)

## License

This component is ready for commercial use in your projects.