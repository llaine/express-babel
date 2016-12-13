// @flow
'use strict';

import LokaliseService from '../services/lokalise';

/**
 * Index controller for /projects route
 * @param request
 * @param response
 * @param next
 */
export function index(request: any, response: any, next: any) {
  LokaliseService.getProjects()
      .then(projects => response.send(projects))
      .catch(next);
}

