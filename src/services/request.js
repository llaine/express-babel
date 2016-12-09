'use strict';

import request from 'request';

export default class RequestService {
  constructor(url, apiToken) {
    this.apiToken = apiToken;
  }

  get(url) {
    return new Promise(function (resolve, reject) {
      const qs = {
        api_token: this.api_token
      };
      request.get({url, qs}).on('error', function (err) {
        reject(err);
      }).on('response', function (response) {
        resolve(response)
      })
    });
  }

}
