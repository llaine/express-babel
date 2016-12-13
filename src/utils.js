// @flow
'use strict';


export function promisify(methodName: any) {
  return (...args: any) => {
    return new Promise((resolve, reject) => {
      methodName(...args, (error, ...result) => {
        if (error) return reject(error);

        return result.length < 2 ? resolve(...result) : resolve(result);
      });
    });
  };
}
