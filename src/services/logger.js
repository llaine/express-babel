'use strict';

import winston from 'winston';

const timestampFormat = () => new Date().toLocaleTimeString();
const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      timestamp: timestampFormat,
      colorize: true
    })
  ]
});


export function debug(args) {
  logger.level = 'debug';
  logger.debug(`${args}`);
}

/**
 * Default logger middleware.
 * Display basic logging feature like
 * [09-12-2016 10:01:59-714 from ::1] Method GET on resource /
 */
export function logRequest(...args) {
  let computedArgs = args;

  if (typeof computedArgs[0] === 'string') {
    computedArgs = `${computedArgs[0]}`;
  } else {
    /* Assume the parameter is a request */
    computedArgs = `[${computedArgs[0].connection.remoteAddress}] ${computedArgs[1]}`;
  }

  logger.info(computedArgs);
}
