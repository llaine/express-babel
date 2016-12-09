'use strict';

/**
 * Return formated date like
 * 09-12-2016 09:59:52-788
 * @param d
 * @returns {string}
 */
const formatDate = (d) => {
  let dd = d.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = d.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = d.getFullYear();

  let hh = d.getHours();
  if (hh < 10) hh = '0' + hh;

  let MM = d.getMinutes();
  if (MM < 10) MM = '0' + MM;

  let ss = d.getSeconds();
  if (ss < 10) ss = '0' + ss;

  return dd + '-' + mm + '-' + yy + ' ' + hh + ':' + MM + ":" + ss + "-" + d.getMilliseconds();
}


/**
 * Default logger middleware.
 * Display basic logging feature like
 * [09-12-2016 10:01:59-714 from ::1] Method GET on resource /
 */
export default function () {
  if (typeof arguments[0] === "string") {
    arguments[0] = "[" + formatDate(new Date()) + "] " + arguments[0];
  } else {
    /* Assume the parameter is a request */
    arguments[0] = "[" + formatDate(new Date()) + " from " + arguments[0].connection.remoteAddress + "] " + arguments[1];
    arguments[1] = "";
  }
  try {
    /* Try first the most common logging method */
    console.log.apply(console, arguments);
  } catch (e) {
    try {
      /* try to log using opera function */
      opera.postError.apply(opera, arguments);
    } catch (e) {
      alert(Array.prototype.join.call(arguments, " "));
    }
  }
}
