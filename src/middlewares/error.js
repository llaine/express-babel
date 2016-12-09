'use strict';

/**
 * Error middleware
 * @param error
 * @param request
 * @param response
 * @param next
 */
export default function(error, request, response) {
  response.status(error.statusCode || 500).send({code: error.code, message: error.message});
}

