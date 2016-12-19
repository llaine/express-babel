// @flow
'use strict';

import request from 'request-promise-native';

import FileSystemService from './file';
import {debug} from '../services/logger';

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
    const qs = {
      api_token: this.apiToken
    };
    return request.get({url, qs, json: true});
  }

  /**
   * Do a POST request with the lokalise apiToken and the form parameters.
   * @param url
   * @param form
   * @returns {Promise}
   */
  post(url: string, form: any) {
    const formData = {
      ...form,
      api_token: this.apiToken,
      export_all: 1
    };

    return request.post({url, form: formData, json: true});
  }

  /**
   * get the export URL for exporting a lokalise project.
   * @param url
   * @param form
   * @returns {Promise}
   */
  getArchivePath(url: string, form: any) {
    debug(`#getArchivePath : Downloading ${url} with params ${JSON.stringify(form)}`);

    return this.post(url, form)
        .then(result => {
          debug(`#getArchivePath : done ${JSON.stringify(result)}`);
          return result;
        }).catch(err => {
          debug('#getArchivePath : error', err);
          return err;
        });
  }

  /**
   * Download file and return the body in the promise
   * @param url
   * @returns {Promise}
   */
  downloadFile(url: string) {
    debug(`#downloadZipFile : Downloading now ${url}`);
    return request({url: url, encoding: null});
  }

  /**
   * Download the zip
   * @param url
   * @param form
   * @returns {Promise}
   */
  processZipFile(url: string, form: any): Promise<*> {
    const downloadParams = arguments;
    const BASE_URL = 'https://lokalise.co/';
    const projectKeyId: string = form.id;

    debug(`#downloadZip : Getting archive url for ${projectKeyId}`);
    return this.getArchivePath(...downloadParams).then(lokaliseResponse => {
      const filePath = lokaliseResponse.bundle.file;
      const fileUrl = `${BASE_URL}${filePath}`;
      return this.downloadFile(fileUrl);
    }).then(body => {
      const tempFileName: string = `${new Date().getTime()}-${projectKeyId}.zip`;
      return FileSystemService.saveFile(tempFileName, body, projectKeyId);
    });
  }
}
