'use strict';
import LoggerService from '../services/logger';

/**
 * Logger middleware for each method.
 * @param req
 * @param res
 * @param next
 */
export default function (req, res, next) {
  LoggerService(req, "Method " + req.method + " on resource " + req.url);
  next();
}
