'use strict';

import sinon from 'sinon';
import chai from 'chai';
import request from 'request';

import RequestService from '../../src/services/request';

describe('RequestService', () => {
  describe('#get', () => {
    it('crash if the url is empty', done => {
      chai.expect(function () {
        new RequestService('').get('')
            .error(function (err) {
              chai.expect(err).not.to.be.empty
            })
      }).to.throw;
      done()
    });

    it('crash if the url is not correct', done => {
      chai.expect(function () {
        new RequestService().get('toto').error(function (err) {
              chai.expect(err).not.to.be.empty
            })
      }).to.throw;

      chai.expect(function () {
        new RequestService().get('htpp://fee').error(function (err) {
          chai.expect(err).not.to.be.empty
        })
      }).to.throw;
      done()
    });

    const expectedResp = {hello:'world'};
    before(() => sinon.stub(request, 'get').yields(JSON.stringify(expectedResp)));
    after(() => request.get.restore());


    it('give you a promise when everything work fine', done => {
      new RequestService().get('http://google.com')
        .then(function (result) {
          request.get.called.should.be.equal(true);
          chai.expect(result).not.to.be.empty
          chai.expect(result).to.deep.equal(expectedResp)
          done()
        }).catch(() => done())
    });

  });
});

