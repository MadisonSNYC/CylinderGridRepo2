import { ContentProvider } from './ContentProvider';

/**
 * Contentful content provider for fetching Loop/Project data from Contentful CMS
 * Maps Contentful's Loop content type to our project structure
 */
export class ContentfulProvider extends ContentProvider {
  constructor(config = {}) {
    super(config);
    
    // Contentful configuration
    this.spaceId = config.spaceId || process.env.VITE_CONTENTFUL_SPACE_ID;
    this.accessToken = config.accessToken || process.env.VITE_CONTENTFUL_ACCESS_TOKEN;
    this.environment = config.environment || 'master';
    this.contentType = config.contentType || 'loop';
    this.locale = config.locale || 'en-US';
    
    // Initialize Contentful client if available
    this.client = null;
    if (typeof window !== 'undefined' && window.contentful) {
      this.initClient();
    }
  }

  /**
   * Initialize Contentful client
   */
  initClient() {
    if (!this.spaceId || !this.accessToken) {
      console.warn('ContentfulProvider: Missing space ID or access token');
      return;
    }

    try {
      // Using Contentful's CDN client
      this.client = window.contentful.createClient({
        space: this.spaceId,
        accessToken: this.accessToken,
        environment: this.environment
      });
    } catch (error) {
      console.error('Failed to initialize Contentful client:', error);
    }
  }

  /**
   * Extract text from RichText field
   */
  extractRichText(richTextField) {
    if (!richTextField) return '';
    
    // Handle Contentful RichText structure
    if (richTextField.nodeType === 'document' && richTextField.content) {
      return richTextField.content
        .map(node => {
          if (node.nodeType === 'paragraph' && node.content) {
            return node.content.map(text => text.value || '').join('');
          }
          return '';
        })
        .join(' ')
        .trim();
    }
    
    // Fallback for plain text
    return String(richTextField);
  }

  /**
   * Format Contentful Loop entry to our project structure
   */
  formatContentfulLoop(entry) {
    const fields = entry.fields;
    
    return this.formatProject({
      // Map Contentful fields to our project structure
      id: entry.sys.id,
      title: this.extractRichText(fields.title),
      description: this.extractRichText(fields.summary) || this.extractRichText(fields.client),
      
      // Media assets
      thumbnail: fields.coverImage?.fields?.file?.url 
        ? `https:${fields.coverImage.fields.file.url}` 
        : (fields.previewVideo?.fields?.file?.url 
          ? `https:${fields.previewVideo.fields.file.url}` 
          : null),
      
      videoAsset: fields.loopVideo?.fields?.file?.url 
        ? `https:${fields.loopVideo.fields.file.url}`
        : (fields.previewVideo?.fields?.file?.url 
          ? `https:${fields.previewVideo.fields.file.url}` 
          : null),
      
      // Additional fields
      technologies: fields.tags || [],
      url: `/loop/${fields.slug}`,
      category: this.extractRichText(fields.category) || 'loops',
      featured: fields.featured || fields.featureOnLoopPage || false,
      displayPriority: fields.publishedAt ? new Date(fields.publishedAt).getTime() : 0,
      
      // Metadata
      metadata: {
        slug: fields.slug,
        client: this.extractRichText(fields.client),
        body: this.extractRichText(fields.body),
        publishedAt: fields.publishedAt,
        featureOnWorkPage: fields.featureOnWorkPage,
        featureOnLoopPage: fields.featureOnLoopPage,
        contentfulId: entry.sys.id,
        updatedAt: entry.sys.updatedAt
      }
    });
  }

  /**
   * Get all projects from Contentful
   */
  async getProjects() {
    return this.getCached('contentful-loops', async () => {
      if (!this.client) {
        console.warn('Contentful client not initialized, falling back to empty array');
        return [];
      }

      try {
        const response = await this.client.getEntries({
          content_type: this.contentType,
          locale: this.locale,
          include: 2, // Include linked assets
          order: '-fields.publishedAt' // Sort by publish date, newest first
        });

        return response.items.map(entry => this.formatContentfulLoop(entry));
      } catch (error) {
        console.error('Failed to fetch from Contentful:', error);
        return [];
      }
    });
  }

  /**
   * Get featured projects for the helix showcase
   */
  async getFeaturedProjects() {
    return this.getCached('contentful-featured', async () => {
      if (!this.client) {
        return [];
      }

      try {
        const response = await this.client.getEntries({
          content_type: this.contentType,
          locale: this.locale,
          'fields.featureOnLoopPage': true,
          include: 2,
          order: '-fields.publishedAt'
        });

        return response.items.map(entry => this.formatContentfulLoop(entry));
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
        return [];
      }
    });
  }

  /**
   * Get a single project by slug
   */
  async getProjectBySlug(slug) {
    if (!this.client) {
      return null;
    }

    try {
      const response = await this.client.getEntries({
        content_type: this.contentType,
        locale: this.locale,
        'fields.slug': slug,
        include: 2,
        limit: 1
      });

      if (response.items.length > 0) {
        return this.formatContentfulLoop(response.items[0]);
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch project by slug:', error);
      return null;
    }
  }

  /**
   * Static method to load Contentful SDK
   */
  static async loadContentfulSDK() {
    if (typeof window === 'undefined' || window.contentful) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

export default ContentfulProvider;