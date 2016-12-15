'use strict';

import sinon from 'sinon';
import chai, { expect } from 'chai';
import request from 'request-promise-native';

import RequestService from '../../src/services/request';
import conf from '../../src/config/lokalise.json';

describe('RequestService', () => {
  const url = 'https://lokalise.co/api/project/export';
  const params = {id: '7085695957860508106c08.37278469', type:'json'};
  describe('#post', function() {
    this.timeout(10000);
    after(() => {
      request.post.restore();
    })

    it('should call request#post', done => {
      const spyPost = sinon.spy(request, 'post');


      new RequestService(conf.credentials['api-key'])
        .post(url, params)
        .then(() => {
          expect(spyPost.calledOnce).to.be.true;
          done();
        });
    })
  });

  describe('#getArchivePath', () => {
    it('call post', done => {
      const s = new RequestService(conf.credentials['api-key']);
      const spyPost = sinon.spy(s, 'post');

      s.getArchivePath(url, params)
        .then(() => {
          expect(spyPost.calledOnce).to.be.true;
          done()
        })
    })
  })

  describe('#downloadFile', function() {
    this.timeout(10000);
    it('calls request', done => {
      const s = new RequestService(conf.credentials['api-key']);
      const spyPost = sinon.spy(request);

      s.downloadFile(url)
        .then(() => {
          expect(spyPost.calledOnce).to.be.true;
          done()
        })
    })
  })
});

