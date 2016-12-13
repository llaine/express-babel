// @flow

import LokaliseService, { ProjectParams } from '../services/lokalise';

/**
 * Index controller for / route
 * @param req
 * @param res
 */
export function index(req: any, res: any, next: any) {
  const params: ProjectParams = {
    project: req.swagger.params.project.value,
    lang: req.swagger.params.lang.value,
    format: req.swagger.params.format.value || 'json',
    reload: req.swagger.params.reload.value
  };

  Promise.resolve()
    .then(() => {
      if (params.reload) {
        return LokaliseService.getTranslationFromApi(params);
      }
      return LokaliseService.getTranslations(params);
    })
    .then(response => res.send(response))
    .catch(next);
}
