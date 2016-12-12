// @flow
'use strict';

import request from 'request';
import fs from 'fs';
import { unzipIntoFs } from './zip';

export default class RequestService {
  apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

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

  getDownloadUrlForProject(url: string, form: any) {
    return new Promise((resolve, reject) => {
      this.post(url, form).then(result => resolve(result)).catch(error => reject(error));
    });
  }

  downloadZip(url: string, form: any) {
    const downloadParams = arguments;
    return new Promise((resolve, reject) => {
      console.log('Downloading ZIP')
      const BASE_URL = 'https://lokalise.co/';
      const projectKeyId: string = form.id;


      this.getDownloadUrlForProject(...downloadParams).then(result => {
        const filePath = result.bundle.file;
        const tempFileName: string = `${new Date().getTime()}-${projectKeyId}.zip`;
        const fileUrl = `${BASE_URL}${filePath}`;

        request({ url: fileUrl, encoding: null}, function(err, resp, body) {
          if (err) reject(err);
          fs.writeFile(tempFileName, body, function(error) {
            if (error) reject(error);
            unzipIntoFs(tempFileName, projectKeyId);
            resolve();
          });
        });
      }).catch(err => reject(err));
    });
  }
}
