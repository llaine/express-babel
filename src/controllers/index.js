// @flow

import LokaliseService from '../services/lokalise';

import type { ProjectParams } from '../services/lokalise';

type QueryString = {
  project: Array<string>;
  lang: string;
  format: string;
  reload: boolean
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
 * Responsible to fetch multiple project and return them as an array of promises.
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
  }));
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
