import fs from 'fs';
import extract from 'extract-zip';
import { debug } from './logger';

import { promisify } from '../utils';

const BASE_DIR = '/tmp/dooku';

const readdirPromise = promisify(fs.readdir);
const extractPromise = promisify(extract);
const writeFilePromise = promisify(fs.writeFile);

export default class FileSystemService {
  /**
   * Read multiple files from a directory and return all in one object.
   * @param projectName
   * @returns {Promise}
   */
  static readJsonFiles(projectName) {
    const directoryName = `${BASE_DIR}/${projectName}`;
    debug(`#readJsonFiles : Reading multilple JSON file in ${directoryName}`);
    return readdirPromise(directoryName).then(files => Promise.all(files.map(filename => require(`${directoryName}/${filename}`))));
  }

  /**
   * Check if path exists on the filesystem
   * @param path
   * @returns {*}
   */
  static pathExists(path) {
    debug(`#pathExists : Checking path exists ${BASE_DIR}/${path}`);
    return fs.existsSync(`${BASE_DIR}/${path}`);
  }

  /**
   * Unzip the content of file into the filesystem.
   * Name of the folder is going to be the projectKeyId pass in parameter
   * @param file
   * @param projectKeyId
   */
  static unzipIntoFs(file: string, projectKeyId: string) {
    debug(`#unzipIntoFs : Unzipping ${file} for project ${projectKeyId}`);
    return extractPromise(file, { dir: `${BASE_DIR}/${projectKeyId}`}).then(() => FileSystemService.removeFile(file));
  }

  /**
   * Remove a file from the filesystem
   * @param file
   */
  static removeFile(file) {
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
  static saveFile(fileName: string, body: any, projectKeyId: string) {
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
  static readFiles(lang?: string, projectName: string, format: string) {
    debug(`#readFiles : Retrieving translations files for ${lang} at ${projectName} in ${format}`);
    if (!lang) {
      // Reading all from FS
      return FileSystemService.readJsonFiles(projectName);
    }

    const langFile = `${projectName}/${lang}.${format}`;

    if (!FileSystemService.pathExists(langFile)) {
      debug(`#readFiles : ${langFile} doesn't exists`);

      return Promise.reject({
        code: 'nil_translation',
        message: 'Translation requested doesnt exists'
      });
    }

    const fullPathToFile = `${BASE_DIR}/${langFile}`;
    return Promise.resolve(require(fullPathToFile));
  }
}
