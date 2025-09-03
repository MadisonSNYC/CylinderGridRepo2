/**
 * Abstract base class for content providers
 * Allows switching between local data, Contentful, or any other CMS
 */
export class ContentProvider {
  constructor(config = {}) {
    this.config = config;
    this.cache = new Map();
    this.cacheTimeout = config.cacheTimeout || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Get all projects
   * @returns {Promise<Array>} Array of project objects
   */
  async getProjects() {
    throw new Error('getProjects() must be implemented by subclass');
  }

  /**
   * Get a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project object
   */
  async getProject(id) {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id);
  }

  /**
   * Get projects by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Filtered projects
   */
  async getProjectsByCategory(category) {
    const projects = await this.getProjects();
    return projects.filter(p => p.category === category);
  }

  /**
   * Get featured projects
   * @returns {Promise<Array>} Featured projects
   */
  async getFeaturedProjects() {
    const projects = await this.getProjects();
    return projects.filter(p => p.featured);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get from cache or fetch
   * @protected
   */
  async getCached(key, fetcher) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  }

  /**
   * Format project data to ensure consistent structure
   * @protected
   */
  formatProject(rawProject) {
    return {
      id: rawProject.id || String(Date.now()),
      title: rawProject.title || 'Untitled Project',
      description: rawProject.description || '',
      thumbnail: rawProject.thumbnail || null,
      videoAsset: rawProject.videoAsset || null,
      technologies: rawProject.technologies || [],
      url: rawProject.url || '#',
      category: rawProject.category || 'general',
      featured: rawProject.featured || false,
      displayPriority: rawProject.displayPriority || 0,
      metadata: rawProject.metadata || {}
    };
  }
}

export default ContentProvider;