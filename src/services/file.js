import fs from 'fs';
import extract from 'extract-zip';
import { debug } from './logger';
export const BASE_DIR = '/tmp/dooku/';


export default class FileSystemService {
  /**
   * Read a file and return the result as JSON object
   * @param file
   * @returns {Promise}
   */
  static readJsonFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        }
        else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  /**
   * Read multiple files from a directory and return all in one object.
   * @param directory
   * @returns {Promise}
   */
  static readJsonFiles(directory) {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filesPromises = files.map(filename => FileSystemService.readJsonFile(`${directory}${filename}`));
          Promise
            .all(filesPromises)
            .then(result => resolve(result))
            .catch(error => reject(error));
        }
      });
    });
  }

  static pathExists(path) {
    return fs.existsSync(path);
  }

  static unzipIntoFs(file: string, projectKeyId: string) {
    debug(`#unzipIntoFs : Unzipping ${file} for project ${projectKeyId}`);

    extract(file, { dir: `${BASE_DIR}/${projectKeyId}`}, function(err) {
      if (err) throw err;

      debug('#unzipIntoFs : File unzipped, removing from FS ....');

      FileSystemService.removeFile(file);
    });
  }

  static removeFile(file) {
    debug(`#removeFile : Removing ${file} from the filesystem`);
    fs.unlinkSync(file);
  }

  static saveZipFile(fileName: string, body: any, projectKeyId: string) {
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
