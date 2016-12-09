'use strict';
import loggerService from '../services/logger';

/**
 * Logger middleware for each method.
 * @param req
 * @param res
 * @param next
 */
export default function(req, res, next) {
  loggerService(req, 'Method ' + req.method + ' on resource ' + req.url);
  next();
}
