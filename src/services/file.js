import fs from 'fs';
import extract from 'extract-zip';
import { debug } from './logger';


const BASE_DIR = '/tmp/dooku';

export default class FileSystemService {
  /**
   * Read a file and return the result as JSON object
   * @param file
   * @returns {Promise}
   */
  static readJsonFile(file) {
    return new Promise((resolve, reject) => {
      const fileName = `${BASE_DIR}/${file}`;
      fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        } else {
          debug(`#readJsonFile : Reading JSON file ${fileName}`);

          resolve(JSON.parse(data));
        }
      });
    });
  }

  /**
   * Read multiple files from a directory and return all in one object.
   * @param projectName
   * @returns {Promise}
   */
  static readJsonFiles(projectName) {
    return new Promise((resolve, reject) => {
      const directoryName = `${BASE_DIR}/${projectName}`;
      fs.readdir(directoryName, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filesPromises = files.map(filename => FileSystemService.readJsonFile(`${projectName}${filename}`));

          debug(`#readJsonFiles : Reading multilple JSON file in ${directoryName}`);

          Promise
            .all(filesPromises)
            .then(result => resolve(result))
            .catch(error => reject(error));
        }
      });
    });
  }

  /**
   * Check if path exists on the filesystem
   * @param path
   * @returns {*}
   */
  static pathExists(path) {
    debug('#pathExists : Checking path exists');
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

    extract(file, { dir: `${projectKeyId}`}, function(err) {
      if (err) throw err;

      debug('#unzipIntoFs : File unzipped, removing from FS ....');

      FileSystemService.removeFile(file);
    });
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
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, body, function(error) {
        if (error) reject(error);

        debug('#saveZipFile : Writing .zip into filesystem');

        FileSystemService.unzipIntoFs(fileName, projectKeyId);

        resolve();
      });
    });
  }
}
