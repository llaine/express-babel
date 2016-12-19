'use strict';

import sinon from 'sinon';
import chai, { expect } from 'chai';
import request from 'request-promise-native';

import RequestService from '../../src/services/request';
import FSService from '../../src/services/file';
import conf from '../../src/config/lokalise.json';

const FactoryRequestService = () => new RequestService(conf.credentials['api-key']);

describe('RequestService', function() {
  this.timeout(10000);

  const url = 'https://lokalise.co/api/project/export';
  const params = {id: '7085695957860508106c08.37278469', type:'json'};
  describe('#post', function() {
    afterEach(() => {
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
          s.post.restore()
          done()
        })

    })
  })

  describe('#processZipFile', function() {
    xit('calls getArchivePath', done => {
      const reqService = FactoryRequestService();
      const archivePath = sinon.stub(reqService, 'getArchivePath')
                                .yields("then", JSON.stringify({bundle:{file:'file'}}));
      const downloadFile = sinon.stub(reqService, 'downloadFile')
          .yields('then', 'hello world');

      reqService.processZipFile(url, params).then(() => done());

      archivePath.restore();
      downloadFile.restore();

      sinon.assert.calledWith(archivePath, {url, params});
    })
  })
});
