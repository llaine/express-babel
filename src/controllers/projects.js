// @flow
'use strict';

import LokaliseService from '../services/lokalise';

/**
 * Index controller for /projects route
 * @param request
 * @param response
 */
export function index(request: any, response: any) {
  const l = new LokaliseService();
  l.getProjects().then(projects => response.send(projects));
}

