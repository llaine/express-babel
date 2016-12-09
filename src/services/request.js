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
      request.get({url, qs}, (error, response, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
    });
  }

}
