import FileSystemService from './file';
import RequestService from './request';
import {debug} from '../services/logger';

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
export default class LokaliseService {
  constructor() {
    this.token = lokaliseConfig.credentials['api-key'];
    this.requestService = new RequestService(this.token);
    this.responses = {
      folder_is_nil: {
        code: 'nil_folder'
      },
      translation_is_nil: {
        code: 'nil_translation',
        message: 'Translation requested doesnt exists'
      }
    };
  }

  /**
   * Load project from the Lokalise API
   * @returns {Promise}
   */
  getProjects() {
    debug('#getProjects');
    return new Promise((resolve, reject) => {
      this.requestService.get(lokaliseConfig.resources.projects)
          .then((result) => resolve(result.projects))
          .catch((err) => reject(err));
    });
  }

  /**
   * Get the translations from the file system.
   * if
   * @param params
   * @returns {Promise}
   */
  getTranslationFromFS(params: ProjectParams) {
    return new Promise((resolve, reject) => {
      if (FileSystemService.pathExists(params.project)) {
        debug(`#getTranslationFromFS : get translations from filesystem with : ${JSON.stringify(params)}`);

        FileSystemService.readFiles(params.lang, params.project, params.format)
            .then(result => resolve(result))
            .catch(err => reject(err));
      } else {
        debug(`#getTranslationFromFS : project directory ${params.project} doesnt exists`);

        reject(this.responses.folder_is_nil);
      }
    });
  }

  /**
   * Get the translations from api.
   * - Download a zip file and read the translations from the FS
   * @param params
   * @returns {Promise}
   */
  getTranslationFromApi(params: ProjectParams) {
    return new Promise((resolve, reject) => {
      debug(`#getTranslationFromApi : Getting translations for ${params.project} with type ${params.format}`);
      this.requestService
          .processZipFile(lokaliseConfig.resources.download, {id: params.project, type: params.format})
          .then(() => {
            debug('#getTranslationFromApi : Zip file processed ZIP finished');
            // Once we downloaded the zip, we can read it from the file system.
            this.getTranslationFromFS(params)
                .then(result => resolve(result))
                .catch(err => reject(err));
          })
          .catch(error => reject(error));
    });
  }


  /**
   * Get specific translations for project
   * @param params
   * @returns {Promise}
   */
  getTranslations(params: ProjectParams): Promise {
    return new Promise((resolve, reject) => {
      debug('#getTranslationsForProject : Getting translations for project');

      this.getTranslationFromFS(params)
          .then(result => resolve(result))
          .catch(error => {
            if (error.code === 'nil_folder') {
              this.getTranslationFromApi(params).then(result => resolve(result)).catch(err => reject(err));
            } else {
              reject(error);
            }
          });
    });
  }
}
