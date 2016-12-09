import sinon from 'sinon';
import chai from 'chai';

import Lokalise from '../../src/services/lokalise';
import RequestService from '../../src/services/request';

describe('Lokalise', () => {
  it('#getProjects', done => {
    const t = sinon.stub(RequestService, 'get');
    const token = 'token';
    const service = new Lokalise()

    service.getProjects().then(result => {
      chai.expect(t).to.be.called;
      done();
    }).catch(done())
  })
})
