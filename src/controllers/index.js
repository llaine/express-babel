// @flow

import LokaliseService from '../services/lokalise';
import _ from 'lodash';

import type { ProjectParams } from '../services/lokalise';

type Translation = Object
type Translations = Array<Array<Translation>>;
type QueryString = {
  project: Array<string>;
  lang: string;
  format: string;
  reload: boolean
};

const Locales = ['de', 'en', 'es', 'fr', 'nl', 'tr'];
const mergeTwoTranslationObj = (firstObj: Translation, secondObj: Translation): Translation => Object.assign(firstObj, secondObj);
const appendLocaleInTranslation = (locale: string, translation: Translation) => {
  return {
    [locale]: translation
  };
};

/**
 * Transform a string separated with commas to an array.
 * @param projects
 * @returns {Array}
 */
function sanitizeProjects(projects: string): Array<string> {
  const commaSeparator: string = ',';
  const arr: Array<string> = projects.split(commaSeparator);
  return arr.map(item => item.trim());
}


/**
 * Merge multiple translations project into one big object
 * for every language.
 * @param translations
 * @returns {*}
 */
function mergeTranslationsForMultipleLocale(translations: Translations): Array<Translation> {
  // Removing the first element
  const firstTranslationProject: Array<Translation> = translations.shift();
  const translationsFlattened: Array<Array<Translation>> = translations.map((promise, i) => {
    return firstTranslationProject.map((currentTranslation: Translation, position: number) => {
      const otherTranslationProject: Translation = translations[i][position];
      return appendLocaleInTranslation(Locales[position], mergeTwoTranslationObj(currentTranslation, otherTranslationProject));
    });
  });

  return _.first(translationsFlattened);
}

/**
 * Merge multiple translations project for one locale.
 * @param translations
 * @returns {*}
 */
function mergeTranslationsForOneLocale(translations: Translations): Translation {
  return Object.assign({}, ...translations);
}

/**
 * Merge multiple translations project into one big object.
 * @param translations
 * @param isLangQueried
 * @returns {*}
 */
function mergeTranslations(translations: Translations, isLangQueried: boolean): Array<Translation> | Translation {
  if (isLangQueried) {
    return mergeTranslationsForOneLocale(translations)
  }

  return mergeTranslationsForMultipleLocale(translations);
}

/**
 * This function is responsible to handle the &reload=true case where the user
 * ask specifically to reload the assets for one project.
 * @param project
 * @returns {Promise.<*>}
 */
function fetchOneProject(project: ProjectParams): Promise<*> {
  if (project.reload) {
    return LokaliseService.getTranslationFromApi(project);
  }

  return LokaliseService.getTranslations(project);
}

/**
 * Responsible to fetch multiple project and them as a single object.
 * @param params
 * @returns {Promise.<*>}
 */
function fetchMultipleProjects(params: QueryString): Promise<*> {
  return Promise.all(params.project.map(projectName => {
    const project: ProjectParams = {
      ...params,
      project: projectName
    };

    return fetchOneProject(project);
  }))
  /**
   * Merging all the results into one.
   */
  .then((translations: Translations) => {
    const isLangQueried: boolean = !!params.lang;
    return mergeTranslations(translations, isLangQueried);
  });
}

/**
 * Index controller for / route
 * @param req
 * @param res
 * @param next
 */
export function index(req: any, res: any, next: any) {
  const params: QueryString = {
    project: sanitizeProjects(req.swagger.params.project.value),
    lang: req.swagger.params.lang.value,
    format: req.swagger.params.format.value || 'json',
    reload: req.swagger.params.reload.value
  };

  Promise.resolve()
    .then(() => {
      if (params.project.length > 1) {
        return fetchMultipleProjects(params);
      }

      return fetchOneProject({ ...params, project: params.project[0] });
    })
    .then(result => res.send(result))
    .catch(next);
}
