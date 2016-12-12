// @flow

import LokaliseService from '../services/lokalise';

import { ProjectParams } from '../services/lokalise';

/**
 * Index route
 * @param req
 * @param res
 */
export function index(req: any, res: any) {
  const params: ProjectParams = {
    project: req.swagger.params.project.value,
    lang: req.swagger.params.lang.value,
    format: req.swagger.params.format.value,
    reload: req.swagger.params.reload.value
  };

  const lokalise = new LokaliseService();

  if (params.reload) {
    lokalise.getTranslationFromApi(params)
        .then(result => res.send(result))
        .catch(err => res.send(err));
  } else {
    lokalise.getTranslation(params)
        .then(result => res.send(result))
        .catch(err => res.send(err));
  }
}
