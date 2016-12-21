// @flow
'use strict';

import fs from 'fs';
import extract from 'extract-zip';
import path from 'path';

import {debug} from './logger';
import {promisify} from './utils';
import * as errors from './error';

const BASE_DIR = '/tmp/dooku';
const EXISTING_FORMATS = ['po', 'xls', 'strings', 'xliff', 'xml', 'json', 'php', 'yml', 'properties', 'ini'];

const readdirPromise = promisify(fs.readdir);
const extractPromise = promisify(extract);
const writeFilePromise = promisify(fs.writeFile);
const readfilePromise = promisify(fs.readFile);


export default class FileSystemService {
  /**
   * Read multiple files from a directory and return all in one object.
   * @param projectName
   * @param format
   * @returns {Promise}
   */
  static readMultipleFiles(projectName: string, format: string): Promise<*> {
    const directoryName: string = `${BASE_DIR}/${projectName}`;
    debug(`#readJsonFiles : Reading multilple ${format} file in ${directoryName}`);
    return readdirPromise(directoryName)
        .then(files =>
            Promise.all(files
                .filter(file => file.split('.')[1] === format)
                .map(filename => FileSystemService
                    ._readFileWithFormat(`${directoryName}/${filename}`, format))));
  }

  /**
   * Check if path exists on the filesystem
   * @param pathName
   * @returns {*}
   */
  static pathExists(pathName: string): boolean {
    debug(`#pathExists : Checking path exists ${BASE_DIR}/${pathName}`);
    return fs.existsSync(`${BASE_DIR}/${pathName}`);
  }

  /**
   * Unzip the content of file into the filesystem.
   * Name of the folder is going to be the projectKeyId pass in parameter
   * @param file
   * @param projectKeyId
   */
  static unzipIntoFs(file: string, projectKeyId: string): Promise<*> {
    debug(`#unzipIntoFs : Unzipping ${file} for project ${projectKeyId}`);
    return extractPromise(file, {dir: `${BASE_DIR}/${projectKeyId}`}).then(() => FileSystemService.removeFile(file));
  }

  /**
   * Remove a file from the filesystem
   * @param file
   */
  static removeFile(file): void {
    debug(`#removeFile : Removing ${file} from the filesystem`);
    fs.unlinkSync(`${file}`);
  }

  /**
   * Write file into the file system.
   * @param fileName
   * @param body
   * @param projectKeyId
   * @returns {Promise}
   */
  static saveFile(fileName: string, body: any, projectKeyId: string): Promise<*> {
    debug('#saveZipFile : Writing .zip into filesystem');
    return writeFilePromise(fileName, body).then(() => FileSystemService.unzipIntoFs(fileName, projectKeyId));
  }

  /**
   * Retrive translations for one or multiple language
   * in a directory.
   * @param lang
   * @param projectName
   * @param format
   * @returns {Promise}
   */
  static translations(lang?: string, projectName: string, format: string): Promise<*> {
    debug(`#readFiles : Retrieving translations files for ${lang ? lang : ''} at ${projectName} in ${format}`);
    if (!lang) return FileSystemService.readMultipleFiles(projectName, format);

    const translationsFile = `${projectName}/${lang}.${format}`;

    if (!EXISTING_FORMATS.includes(format)) {
      debug(`#readFiles : ${format} doesn't exists`);
      return Promise.reject(errors.undefinedFormat());
    }

    if (!FileSystemService.pathExists(translationsFile)) {
      debug(`#readFiles : ${translationsFile} doesn't exists`);
      return Promise.reject(errors.nilTranslationError());
    }

    const fullPathToFile: string = `${BASE_DIR}/${translationsFile}`;
    return Promise.resolve(FileSystemService._readFileWithFormat(fullPathToFile, format));
  }

  /**
   * Read a file within his format.
   * If we have JSON, return JSON file.
   * @param file
   * @param format
   * @returns {Request|Promise.<TResult>|*}
   * @private
   */
  static _readFileWithFormat(file: string, format: string): Promise<Object> {
    debug(`#_readFileWithFormat: Reading ${file} with ${format}`);
    return readfilePromise(file, 'utf8')
      .then(result => {
        if (format === 'json') {
          return JSON.parse(result);
        }

        return result;
      });
  }
}
