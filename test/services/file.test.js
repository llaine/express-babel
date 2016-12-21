// @flow
'use strict';

import sinon from 'sinon';
import {expect} from 'chai';


import FileSystemService from '../../src/services/file';

import fs from 'fs';


describe('#FileSystemService', () => {
  const projectName = '7085695957860508106c08.37278469';
  const json = 'json';

  describe('#readMultipleFiles', () => {
    it('read the filesystem with the folder', done => {
      const s = sinon.spy(fs, 'readdir');
      FileSystemService.readMultipleFiles(projectName, json)
          .then(() => {
            expect(s.calledOnce).to.be.true;
            done();
          })
    })
  });
});