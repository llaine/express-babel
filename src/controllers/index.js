// @flow

import LokaliseService from '../services/lokalise';

/**
 * Index route
 * @param req
 * @param res
 */
export function index(req: any, res: any) {
  new LokaliseService()
      .getProjects()
      .then(projects => {
        res.send(projects);
      });
}
