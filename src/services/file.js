import fs from 'fs';

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
}
