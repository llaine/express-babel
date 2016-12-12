import sinon from 'sinon';
import chai from 'chai';

import assert from 'assert';

import Lokalise from '../../src/services/lokalise';
import RequestService from '../../src/services/request';

describe('Lokalise', () => {
  describe('#getProjects', () => {
    it('call the RequestService with the good url', done => {
      const t = sinon.spy(RequestService, 'get');
      const token = 'token';
      const service = new Lokalise();

      service.getProjects().then(result => {
        const p = t.calledWith('https://lokalise.co/api/project/list');
        done();
      })
    })
  })
})
