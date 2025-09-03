import { ContentProvider } from './ContentProvider';
import { projects } from '../data/projects';

/**
 * Local content provider using static project data
 * This is the default provider that uses the existing local data
 */
export class LocalContentProvider extends ContentProvider {
  constructor(config = {}) {
    super(config);
    this.projects = config.projects || projects;
  }

  /**
   * Get all projects from local data
   * @returns {Promise<Array>} Array of project objects
   */
  async getProjects() {
    return this.getCached('all-projects', async () => {
      // Simulate async behavior for consistency
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Format all projects to ensure consistent structure
      return this.projects.map(p => this.formatProject(p));
    });
  }

  /**
   * Add a project (local only, not persisted)
   * @param {Object} project - Project to add
   */
  addProject(project) {
    const formatted = this.formatProject(project);
    this.projects.push(formatted);
    this.clearCache();
    return formatted;
  }

  /**
   * Update a project (local only, not persisted)
   * @param {string} id - Project ID
   * @param {Object} updates - Updates to apply
   */
  updateProject(id, updates) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = this.formatProject({
        ...this.projects[index],
        ...updates
      });
      this.clearCache();
      return this.projects[index];
    }
    return null;
  }

  /**
   * Remove a project (local only, not persisted)
   * @param {string} id - Project ID to remove
   */
  removeProject(id) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      const removed = this.projects.splice(index, 1)[0];
      this.clearCache();
      return removed;
    }
    return null;
  }

  /**
   * Generate mock projects for testing
   * @param {number} count - Number of projects to generate
   */
  static generateMockProjects(count = 12) {
    return Array.from({ length: count }, (_, i) => ({
      id: `mock-${i + 1}`,
      title: `Project ${i + 1}`,
      description: `Description for project ${i + 1}`,
      thumbnail: null,
      videoAsset: null,
      technologies: ['React', 'Three.js', 'WebGL'].slice(0, (i % 3) + 1),
      url: `/project/${i + 1}`,
      category: ['creative', 'technical', 'experimental'][i % 3],
      featured: i % 4 === 0,
      displayPriority: i
    }));
  }
}

export default LocalContentProvider;