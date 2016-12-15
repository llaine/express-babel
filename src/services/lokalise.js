// @flow
'use strict';

import FileSystemService from './file';
import RequestService from './request';
import { debug } from '../services/logger';
import * as errors from './error';

import lokaliseConfig from '../config/lokalise.json';

export type ProjectParams = {
  lang: string ;
  project: string;
  format: string,
  reload: boolean
};

/**
 * Lokalise service.
 * This class convers all of the function of lokalise.
 * - Listing projects.
 * - Exporting projects
 */
class LokaliseService {
  token: string;
  requestService: Object;

  constructor(): void {
    this.token = lokaliseConfig.credentials['api-key'];
    this.requestService = new RequestService(this.token);
  }

  /**
   * Load project from the Lokalise API
   * @returns {Promise}
   */
  getProjects(): Promise<*> {
    debug('#getProjects');
    return this.requestService.get(lokaliseConfig.resources.projects).then((result) => result.projects);
  }

  /**
   * Get the translations from the file system.
   * if
   * @param params
   * @returns {Promise}
   */
  getTranslationFromFS(params: ProjectParams): Promise<*> {
    if (!FileSystemService.pathExists(params.project)) {
      debug(`#getTranslationFromFS : project directory ${params.project} doesnt exists`);
      return Promise.reject(errors.nilFolderError());
    }

    debug(`#getTranslationFromFS : get translations from filesystem with : ${JSON.stringify(params)}`);
    return FileSystemService.translations(params.lang, params.project, params.format);
  }

  /**
   * Get the translations from api.
   * - Download a zip file and read the translations from the FS
   * @param params
   * @returns {Promise}
   */
  getTranslationFromApi(params: ProjectParams): Promise<*> {
    debug(`#getTranslationFromApi : Getting translations for ${params.project} with type ${params.format}`);
    return this.requestService
        .processZipFile(lokaliseConfig.resources.download, {id: params.project, type: params.format})
        .then(() => {
          debug('#getTranslationFromApi : Zip file processed ZIP finished');
          // Once we downloaded the zip, we can read it from the file system.
          return this.getTranslationFromFS(params);
        });
  }

  /**
   * Get specific translations for project
   * @param params
   * @returns {Promise}
   */
  getTranslations(params: ProjectParams): Promise<*> {
    debug('#getTranslationsForProject : Getting translations for project');
    return this.getTranslationFromFS(params)
      .catch(error => {
        if (error.code === 'nil_folder' || error.code === 'nil_translation') {
          return this.getTranslationFromApi(params);
        }

        throw error;
      });
  }
}

export default new LokaliseService();
