'use strict';

import http from 'http';
import assert from 'assert';

import '../src/server.js';

describe('Example Node Server', () => {
  it('should return 200', done => {
    http.get('http://localhost:3000', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
