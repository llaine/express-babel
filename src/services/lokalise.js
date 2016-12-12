
import FileSystemService from './file';
import RequestService from './request';

import lokaliseConfig from '../config/lokalise.json';

import { BASE_DIR } from './zip';

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
        this.retrieveTranslationsFiles(params.lang, projectDirectory)
            .then(result => resolve(result))
            .catch(err => reject(err));
      } else {
        reject(this.responses.path_doesnt_exists);
      }
    });
  }

  /**
   * Retrive translations for one or multiple language
   * in a directory.
   * @param lang
   * @param projectDir
   * @returns {Promise}
   */
  retrieveTranslationsFiles(lang?: string, projectDir: string) {
    return new Promise((resolve, reject) => {
      if (lang) {
        const langFile = `${projectDir}${lang}.json`;
        if (FileSystemService.pathExists(langFile)) {
          FileSystemService.readJsonFile(langFile)
              .then(result => resolve(result))
              .catch(r => reject(r));
        } else {
          reject(this.responses.path_doesnt_exists);
        }
      } else {
        FileSystemService.readJsonFiles(projectDir)
            .then(result => resolve(result))
            .catch(r => reject(r));
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
      this.requestService
          .downloadZip(lokaliseConfig.resources.download, { id: params.project, type: 'json' })
          .then(() => {
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
      this.getTranslationFromFS(params)
        .then(result => resolve(result))
        .catch(error => {
          // This project doesnt exists we have to fetch from the API
          if (error.code === 'nil_folder') {
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
