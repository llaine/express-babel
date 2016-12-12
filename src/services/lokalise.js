
import FileSystemService from './file';
import RequestService from './request';
import { debug } from '../services/logger';


import lokaliseConfig from '../config/lokalise.json';

import { BASE_DIR } from './file';

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
    this.BASE_DIR = BASE_DIR;
    this.token = lokaliseConfig.credentials['api-key'];
    this.requestService = new RequestService(this.token);
    this.responses = {
      path_doesnt_exists: {
        code: 'nil_folder'
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
      new RequestService(this.token)
          .get(lokaliseConfig.resources.projects)
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
      const projectDirectory: string = `${this.BASE_DIR}${params.project}/`;

      if (FileSystemService.pathExists(projectDirectory)) {
        debug(`#getTranslationFromFS : get translations from filesystem with : ${JSON.stringify(params)}`);

        this.retrieveTranslationsFiles(params.lang, projectDirectory, params.format)
            .then(result => resolve(result))
            .catch(err => reject(err));
      } else {
        debug(`#getTranslationFromFS : project directory ${projectDirectory} doesnt exists`);

        reject(this.responses.path_doesnt_exists);
      }
    });
  }

  /**
   * Retrive translations for one or multiple language
   * in a directory.
   * @param lang
   * @param projectDir
   * @param format
   * @returns {Promise}
   */
  retrieveTranslationsFiles(lang?: string, projectDir: string, format: string) {
    return new Promise((resolve, reject) => {
      debug(`#retrieveTranslationsFiles : Retrieving translations files for ${lang} at ${projectDir} in ${format}`);
      if (!lang) {
        // Reading all from FS
        FileSystemService.readJsonFiles(projectDir).then(result => resolve(result)).catch(r => reject(r));
        return;
      }

      const langFile = `${projectDir}${lang}.${format}`;

      if (FileSystemService.pathExists(langFile)) {
        FileSystemService.readJsonFile(langFile).then(result => resolve(result)).catch(r => reject(r));
      } else {
        debug(`#retrieveTranslationsFiles : ${langFile} doesn't exists`);
        reject(this.responses.path_doesnt_exists);
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
          .processZipFile(lokaliseConfig.resources.download, { id: params.project, type: params.format })
          .then(() => {
            debug('#getTranslationFromApi : Downloading ZIP finished');
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
  getTranslation(params: ProjectParams): Promise {
    return new Promise((resolve, reject) => {
      debug('#getTranslation : Getting translations for project');
      this.getTranslationsForProject(params)
          .then(result => resolve(result))
          .catch(error => reject(error));
    });
  }

  /**
   * Handle the fetching of the translations.
   * By default coming from the file system.
   * @param params
   * @returns {Promise}
   */
  getTranslationsForProject(params: ProjectParams) {
    return new Promise((resolve, reject) => {
      debug('#getTranslationsForProject : Getting translations for project');

      this.getTranslationFromFS(params)
        .then(result => resolve(result))
        .catch(error => {
          // This project doesnt exists we have to fetch from the API
          if (error.code === 'nil_folder') {
            debug('#getTranslationsForProject : Translations doesnt exists, fetching from api ...');

            this.getTranslationFromApi(params)
                .then(result => resolve(result))
                .catch(err => reject(err));
          } else {
            reject(error);
          }
        });
    });
  }
}
