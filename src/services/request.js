'use strict';

import request from 'request';

export default class RequestService {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  get(url) {
    return new Promise((resolve, reject) => {
      const qs = {
        api_token: this.apiToken
      };
      request.get({url, qs}).on('error', function(err) {
        reject(err);
      }).on('response', function(response) {
        resolve(response);
      });
    });
  }

}
