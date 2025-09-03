export { ContentProvider } from './ContentProvider';
export { LocalContentProvider } from './LocalContentProvider';
export { ContentfulProvider } from './ContentfulProvider';

/**
 * Provider factory to create the appropriate content provider
 * based on configuration or environment
 */
export function createContentProvider(type = 'local', config = {}) {
  switch (type) {
    case 'contentful':
      return new ContentfulProvider(config);
    
    case 'local':
    default:
      return new LocalContentProvider(config);
  }
}

/**
 * Default provider instance (can be overridden)
 */
let defaultProvider = null;

export function getDefaultProvider() {
  if (!defaultProvider) {
    // Check if Contentful credentials are available
    const hasContentfulConfig = 
      (process.env.VITE_CONTENTFUL_SPACE_ID && process.env.VITE_CONTENTFUL_ACCESS_TOKEN) ||
      (typeof window !== 'undefined' && window.CONTENTFUL_CONFIG);
    
    if (hasContentfulConfig) {
      defaultProvider = createContentProvider('contentful');
    } else {
      defaultProvider = createContentProvider('local');
    }
  }
  return defaultProvider;
}

export function setDefaultProvider(provider) {
  defaultProvider = provider;
}