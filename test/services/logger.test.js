import sinon from 'sinon';
import chai from 'chai';

import { logRequest, debug } from '../../src/services/logger';

import winston from 'winston';

describe('Logger', () => {
  describe('#logRequest', () => {
    before(() => sinon.spy(winston, 'info'));
    after(() => winston.info.restore());

    it('display a log in console with string', () => {
      logRequest('Hello World');
      chai.expect(winston.info).to.be.called;
    });

    it('display logging in console with request object', () => {
      const remoteAddress = {connection:{remoteAddress:'remote address'}};
      logRequest(remoteAddress, 'resource')
      chai.expect(winston.info).to.be.called;
    });

    it('dont display if nothing is given to the function', () => {
      chai.expect(() => {
        logRequest()
      }).to.throw
    })
  })
  describe('#debug', () => {
    before(() => sinon.spy(winston, 'debug'));
    after(() => winston.debug.restore());

    it('display a log in console with string', () => {
      debug('Hello World');
      chai.expect(winston.debug).to.be.called;
    });
  })
});
