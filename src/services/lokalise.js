import lokaliseConfig from '../config/lokalise.json';

import RequestService from '../services/request';

/**
 * Lokalise service.
 * This class convers all of the function of lokalise.
 * - Listing projects.
 * - Exporting projects
 */
export default class LokaliseService {
  constructor() {
    this.token = lokaliseConfig.credentials['api-key'];
  }

  /**
   * Load project from the Lokalise API
   * @returns {Promise}
   */
  getProjects() {
    return new Promise((resolve, reject) => {
      new RequestService(this.token)
          .get(lokaliseConfig.resources.projects)
          .then((result) => resolve(result.projects))
          .catch((err) => reject(err));
    });
  }
}
