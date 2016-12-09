import sinon from 'sinon';
import chai from 'chai';

import logger from '../../src/services/logger';

describe('Logger', () => {
  describe('#log', () => {
    before(() => sinon.spy(console, 'log'));
    after(() => console.log.restore());


    it('display a log in console with string', () => {
      new logger('Hello World');
      chai.expect(console.log).to.be.called;
    });

    it('display logging in console with request object', () => {
      const remoteAddress = {connection:{remoteAddress:'remote address'}};
      new logger(remoteAddress, 'resource')
      chai.expect(console.log).to.be.called;
    });

    it('dont display if nothing is given to the function', () => {
      chai.expect(() => {
        new logger()
      }).to.throw
    })
  })
});
