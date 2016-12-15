import sinon from 'sinon';
import request from 'request-promise-native';
import { expect } from 'chai'

import conf from '../../src/config/lokalise.json';

import Lokalise from '../../src/services/lokalise';
import RequestService from '../../src/services/request';
import FileSystemService from '../../src/services/file';
import * as errors from '../../src/services/error';

describe('Lokalise', () => {
  describe('#getProjects', function(){
    this.timeout(5000);

    it('call request.get to fetch the projects', done => {
      const t = sinon.spy(request, 'get');
      const token = 'token';

      Lokalise.getProjects().then(() => {
        expect(t.calledWith(conf.resources.project));
        done();
      })
    })
  });

  describe('#getTranslationFromFS', () => {
    it('call the FileSystemService if the project exists', done => {
      const projectId = '6196687557a89353d977e0.90613043';
      const t = sinon.spy(FileSystemService, 'translations');
      const p = sinon.spy(FileSystemService, 'pathExists');

      Lokalise.getTranslationFromFS({project: projectId})
          .then(() => {
            expect(t.calledOnce).to.be.true;
            expect(p.calledOnce).to.be.true;
            done()
          })
    });

    it('reject an nilFolder error if the project doesnt exists', done => {
      const projectId = 'unexistingProject';
      Lokalise.getTranslationFromFS({project: projectId})
          .catch(err => {
            expect(err).to.be.deep.equal(errors.nilFolderError());
            done()
          })
    })
  });


  describe('#getTranslationFromApi', function() {
    this.timeout(10000);

    after(() => {
      Lokalise.getTranslationFromFS.restore();
    })

    it('call the requestService', done => {
      const l = Lokalise;
      const t = sinon.spy(l.requestService, 'processZipFile');
      const f = sinon.spy(l, 'getTranslationFromFS');
      const params = { format:'json', lang:'en', project: '6196687557a89353d977e0.90613043' };

      l.getTranslationFromApi(params)
        .then(() => {
          expect(t.calledOnce).to.be.true;
          expect(f.calledOnce).to.be.true;
          done()
        })
    })
  });

  describe('#getTranslations', function() {
    this.timeout(10000);

    after(() => Lokalise.getTranslationFromApi.restore());
    afterEach(() => {
      Lokalise.getTranslationFromFS.restore();
    });

    it('read files from FS on an existing project', () => {
      const l = Lokalise;
      const t = sinon.spy(l, 'getTranslationFromFS');
      const params = { format:'json', lang:'en', project: '6196687557a89353d977e0.90613043' };

      l.getTranslations(params)
          .then(() => {
            expect(t.calledOnce).to.be.true;
          })
    });

    it('fetch from the API if an error it throwned', () => {
      const l = Lokalise;
      const fsSpy = sinon.spy(l, 'getTranslationFromFS');
      const apiSpy = sinon.spy(l, 'getTranslationFromApi');
      const params = {format: 'format', lang: 'lang', project: 'few'};

      l.getTranslations(params)
        .then(() => {
          expect(fsSpy.calledOnce).to.be.true
          expect(apiSpy.calledOnce).to.be.true
        })
    })
  })
});
