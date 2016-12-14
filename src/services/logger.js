const DEBUG_ENABLED = true

/**
 * Return formated date like
 * 09-12-2016 09:59:52-788
 * @param d
 * @returns {string}
 */
const formatDate = d => {
  let dd = d.getDate()
  if (dd < 10) dd = `0${dd}`

  let mm = d.getMonth() + 1
  if (mm < 10) mm = `0${mm}`

  const yy = d.getFullYear()

  let hh = d.getHours()
  if (hh < 10) hh = `0${hh}`

  let MM = d.getMinutes()
  if (MM < 10) MM = `0${MM}`

  let ss = d.getSeconds()
  if (ss < 10) ss = `0${ss}`

  return `${dd}-${mm}-${yy} ${hh}:${MM}:${ss}-${d.getMilliseconds()}`
}


export function debug(args) {
  if (DEBUG_ENABLED) {
    console.log(`[${formatDate(new Date())}] - ${args}`) // eslint-disable-line
  }
}

/**
 * Default logger middleware.
 * Display basic logging feature like
 * [09-12-2016 10:01:59-714 from ::1] Method GET on resource /
 */
function logRequest(...args) {
  const computedArgs = args
  if (typeof computedArgs[0] === 'string') {
    computedArgs[0] = `[${formatDate(new Date())}] ${computedArgs[0]}`
  } else {
    /* Assume the parameter is a request */
    computedArgs[0] = `'[${formatDate(new Date())} from ${computedArgs[0].connection.remoteAddress}] ${computedArgs[1]}`
    computedArgs[1] = ''
  }
  /* Try first the most common logging method */
  console.log.apply(console, computedArgs) // eslint-disable-line
}

export default logRequest
