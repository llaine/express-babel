// @flow
'use strict';

import extract from 'extract-zip';
import fs from 'fs';

export const BASE_DIR = '/tmp/dooku/';

export function unzipIntoFs(file: string, projectKeyId: string) {
  console.log('Unzipping zip')
  extract(file, { dir: `${BASE_DIR}/${projectKeyId}`}, function(err) {
    console.log('file extracted');
    fs.unlinkSync(file);
  });
}
