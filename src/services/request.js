// @flow
'use strict';

import request from 'request';

import FileSystemService from './file';
import { debug } from '../services/logger';

/**
 * Wrapper for lokalise request api
 */
export default class RequestService {
  apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  /**
   * Do a get request appending the lokalise ApiToken
   * @param url
   * @returns {Promise}
   */
  get(url: string) {
    return new Promise((resolve, reject) => {
      const qs = {
        api_token: this.apiToken
      };
      request.get({url, qs}, (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
    });
  }

  /**
   * Do a POST request with the lokalise apiToken and the form parameters.
   * @param url
   * @param form
   * @returns {Promise}
   */
  post(url: string, form: any) {
    return new Promise((resolve, reject) => {
      const formData = {
        ...form,
        api_token: this.apiToken
      };

      request.post({url, form: formData}, (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
    });
  }

  /**
   * get the export URL for exporting a lokalise project.
   * @param url
   * @param form
   * @returns {Promise}
   */
  getDownloadUrlForProject(url: string, form: any) {
    return new Promise((resolve, reject) => {
      debug(`#getDownloadUrlForProject : Downloading ${url} with params ${JSON.stringify(form)}`);

      this.post(url, form)
          .then(result => {
            if (result.response.status === 'error') {
              reject(result);
            } else {
              debug(`#getDownloadUrlForProject : Url : ${JSON.stringify(result)}`);
              resolve(result);
            }
          })
          .catch(error => {
            debug(`#getDownloadUrlForProject : Error : ${error}`);
            reject(error);
          });
    });
  }

  /**
   * Download file and return the body in the promise
   * @param url
   * @returns {Promise}
   */
  downloadFile(url: string) {
    return new Promise((resolve, reject) => {
      debug(`#downloadZipFile : Downloading now ${url}`);
      request({ url: url, encoding: null}, function(error, resp, body) {
        if (error) reject(error)
        debug('#downloadZipFile : Download completed');
        resolve(body);
      });
    });
  }

  /**
   * Download the zip
   * @param url
   * @param form
   * @returns {Promise}
   */
  processZipFile(url: string, form: any) {
    const downloadParams = arguments;
    return new Promise((resolve, reject) => {
      const BASE_URL = 'https://lokalise.co/';
      const projectKeyId: string = form.id;

      debug(`#downloadZip : Downloading url for ${projectKeyId}`);
      this.getDownloadUrlForProject(...downloadParams).then(lokaliseResponse => {
        const filePath = lokaliseResponse.bundle.file;
        const tempFileName: string = `${new Date().getTime()}-${projectKeyId}.zip`;
        const fileUrl = `${BASE_URL}${filePath}`;

        this.downloadFile(fileUrl)
            .then(body => {
              FileSystemService.saveZipFile(tempFileName, body, projectKeyId)
                  .then(result => resolve(result))
                  .catch(err => reject(err));
            }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }
}
