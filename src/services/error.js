// @flow
'use strict';


export function nilFolderError() {
  return {
    code: 'nil_folder',
    message: 'Project doesnt exists'
  };
}

export function nilTranslationError() {
  return {
    code: 'nil_translation',
    message: 'Translation requested doesnt exists'
  };
}

export function undefinedFormat() {
  return {
    code: 'undefined_format',
    message: 'Format doesnt exists'
  };
}
