'use strict';

const md5 = require('md5');

////////////////////////////////////////////////////////////////////////////////
// Private (service) functions

function _jsonStringifySync(item) {
  return JSON.stringify(item)
}

async function _jsonStringifyAsync(item) {
  return JSON.stringify(item)
}

function _jsonParseSync(str) {
  return JSON.parse(str)
}

async function _jsonParseAsync(str) {
  return JSON.parse(str)
}

function _deepCopySync(item) {
  let copy = null;
  try {
    let str = _jsonStringifySync(item);
    copy = _jsonParseSync(str);
  } catch (e) {
    copy = item; // item has circ refs, do not use deep copy
  }
  return copy;
}

async function _deepCopyAsync(item) {
  let copy = null;
  try {
    let str = await _jsonStringifyAsync(item);
    copy = await _jsonParseAsync(str);
  } catch (e) {
    copy = item; // item has circ refs, do not use deep copy
  }
  return copy;
}

function _hashString(str) {
  return md5(str)
}

function _hashObjectSync(obj) {
  let str;
  try {
    str = _jsonStringifySync(obj);
  } catch (error) {
    str = '0'; // obj has cyclical refs. bad tmp solution
  }
  return _hashString(str);
}

async function _hashObjectAsync(obj) {
  let str;
  try {
    str = await _jsonStringifyAsync(obj);
  } catch (error) {
    str = '0'; // obj has cyclical refs. bad tmp solution
  }
  return _hashString(str);
}

////////////////////////////////////////////////////////////////////////////////
// Public (export) functions

/**
 * Async merge two array of objects
 *
 * @param arrOriginal - original array
 * @param arrUpdate - array for update
 * @param identifier - field or function for object matching (optional)
 * @returns {Promise<*[]>}
 */
async function arrMergeAsync(arrOriginal, arrUpdate, identifier) {
  const PROD = process.env.NODE_ENV !== 'develop';

  // check input
  if (!arrOriginal) {
    arrOriginal = [];
  }

  if (!arrUpdate) {
    arrUpdate = [];
  }

  if (!Array.isArray(arrOriginal)) {
    arrOriginal = [arrOriginal];
  }

  if (!Array.isArray(arrUpdate)) {
    arrUpdate = [arrUpdate];
  }

  // init
  let arrResult = [].concat(await _deepCopyAsync(arrOriginal));
  let mapOriginal = {};

  let identifierAbsent = !identifier;
  let identifierIsFunc = typeof identifier === 'function';
  let identifierIsStr = false;
  if (!identifierAbsent && !identifierIsFunc) {
    identifier = identifier.toString();
    identifierIsStr = true;
  }

  // scan Original
  for (let index = 0; index < arrOriginal.length; index++) {
    let item = arrOriginal[index];
    let hash = await _hashObjectAsync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {
        if (!PROD) {
          console.error(error.message);
        }
      }
    }
    mapOriginal[key] = {key, hash, index};
  }

  // scan arrUpdate
  let indexNext = arrResult.length;
  for (let item of arrUpdate) {
    let hash = await _hashObjectAsync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {
        if (!PROD) {
          console.error(error.message);
        }
      }
    }
    if (mapOriginal[key]) { // item exists in arrOriginal
      if (mapOriginal[key].hash !== hash) { // need update
        let index = mapOriginal[key].index;
        arrResult[index] = await _deepCopyAsync(item);
        mapOriginal[key] = {key, hash, index};
      }
    } else { // need append new item
      let index = indexNext;
      indexNext = arrResult.push(await _deepCopyAsync(item));
      mapOriginal[key] = {key, hash, index};
    }
  }

  return arrResult;
}

/**
 * Sync merge two array of objects
 *
 * @param arrOriginal - original array
 * @param arrUpdate - array for update
 * @param identifier - field or function for object matching (optional)
 * @returns {*[]}
 */
function arrMergeSync(arrOriginal, arrUpdate, identifier) {
  const PROD = process.env.NODE_ENV !== 'develop';

  // check input
  if (!arrOriginal) {
    arrOriginal = [];
  }

  if (!arrUpdate) {
    arrUpdate = [];
  }

  if (!Array.isArray(arrOriginal)) {
    arrOriginal = [arrOriginal];
  }

  if (!Array.isArray(arrUpdate)) {
    arrUpdate = [arrUpdate];
  }

  // init
  let arrResult = [].concat(_deepCopySync(arrOriginal));
  let mapOriginal = {};

  let identifierAbsent = !identifier;
  let identifierIsFunc = typeof identifier === 'function';
  let identifierIsStr = false;
  if (!identifierAbsent && !identifierIsFunc) {
    identifier = identifier.toString();
    identifierIsStr = true;
  }

  // scan Original
  for (let index = 0; index < arrOriginal.length; index++) {
    let item = arrOriginal[index];
    let hash = _hashObjectSync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {
        if (!PROD) {
          console.error(error.message);
        }
      }
    }
    mapOriginal[key] = {key, hash, index};
  }

  // scan arrUpdate
  let indexNext = arrResult.length;
  for (let item of arrUpdate) {
    let hash = _hashObjectSync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {
        if (!PROD) {
          console.error(error.message);
        }
      }
    }
    if (mapOriginal[key]) { // item exists in arrOriginal
      if (mapOriginal[key].hash !== hash) { // need update
        let index = mapOriginal[key].index;
        arrResult[index] = _deepCopySync(item);
        mapOriginal[key] = {key, hash, index};
      }
    } else { // need append new item
      let index = indexNext;
      indexNext = arrResult.push(_deepCopySync(item));
      mapOriginal[key] = {key, hash, index};
    }
  }

  return arrResult;
}

module.exports = {arrMergeAsync, arrMergeSync};