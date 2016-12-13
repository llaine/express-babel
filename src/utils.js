// @flow
'use strict';

/**
 * Promisified a method.
 * Used most of times for nodejs file system methods that don't
 * provide style API.
 * @param methodName
 * @returns {function(...[any])}
 */
export function promisify(methodName: any) {
  return (...args: any) => {
    return new Promise((resolve: Function, reject: Function) => {
      methodName(...args, (error, ...result) => {
        if (error) return reject(error);
        return result.length < 2 ? resolve(...result) : resolve(result);
      });
    });
  };
}
