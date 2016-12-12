'use strict';
import { logRequest } from '../services/logger';

/**
 * Logger middleware for each method.
 * @param req
 * @param res
 * @param next
 */
export default function(req, res, next) {
  logRequest(req, 'Method ' + req.method + ' on resource ' + req.url);
  next();
}
