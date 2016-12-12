// @flow

import LokaliseService, { ProjectParams } from '../services/lokalise';

/**
 * Index controller for / route
 * @param req
 * @param res
 */
export function index(req: any, res: any) {
  const params: ProjectParams = {
    project: req.swagger.params.project.value,
    lang: req.swagger.params.lang.value || 'en',
    format: req.swagger.params.format.value || 'json',
    reload: req.swagger.params.reload.value
  };

  const lokalise = new LokaliseService();

  if (params.reload) {
    lokalise.getTranslationFromApi(params)
        .then(result => res.send(result))
        .catch(err => res.send(err));
  } else {
    lokalise.getTranslations(params)
        .then(result => res.send(result))
        .catch(err => res.send(err));
  }
}
