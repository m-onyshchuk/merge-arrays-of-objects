'use strict';

const md5 = require('md5');

//////////////////////////////////////////////////////////////
// Private (service) functions

function jsonStringifySync (item) {
  return JSON.stringify(item)
}

async function jsonStringifyAsync (item) {
  return JSON.stringify(item)
}

function jsonParseSync (str) {
  return JSON.parse(str)
}

async function jsonParseAsync (str) {
  return JSON.parse(str)
}

function deepCopySync (item) {
  let copy = null;
  try {
    let str = jsonStringifySync(item);
    copy = jsonParseSync(str);
  } catch (e) {
    copy = item; // item has circ refs, do not use deep copy
  }
  return copy;
}

async function deepCopyAsync (item) {
  let copy = null;
  try {
    let str = await jsonStringifyAsync(item);
    copy = await jsonParseAsync(str);
  } catch (e) {
    copy = item; // item has circ refs, do not use deep copy
  }
  return copy;
}

function hashStringSync (str) {
  return md5(str)
}

async function hashStringAsync (str) {
  return md5(str)
}

function hashObjectSync (obj) {
  let str;
  try {
    str = jsonStringifySync(obj);
  } catch (error) {
    str = '0'; // obj has cyclical refs. bad tmp solution
  }
  return hashStringSync (str);
}

async function hashObjectAsync (obj) {
  let str;
  try {
    str = await jsonStringifyAsync(obj);
  } catch (error) {
    str = '0'; // obj has cyclical refs. bad tmp solution
  }
  return await hashStringAsync (str);
}

//////////////////////////////////////////////////////////////
// Public (export) functions

/**
 * Async merge two array of objects
 *
 * @param arrOriginal - original array
 * @param arrUpdate - array for update
 * @param identifier - field or function for object matching (optional)
 * @returns {Promise<*[]>}
 */
async function arrMergeAsync (arrOriginal, arrUpdate, identifier) {
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
  let arrResult = [].concat(await deepCopyAsync(arrOriginal));
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
    let hash = await hashObjectAsync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {}
    }
    mapOriginal[key] = { key, hash, index };
  }

  // scan arrUpdate
  let indexNext = arrResult.length;
  for (let item of arrUpdate) {
    let hash = await hashObjectAsync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {}
    }
    if (mapOriginal[key]) { // item exists in arrOriginal
      if (mapOriginal[key].hash !== hash) { // need update
        let index = mapOriginal[key].index;
        arrResult[index] = await deepCopyAsync(item);
        mapOriginal[key] = { key, hash, index };
      }
    } else { // need append new item
      let index = indexNext;
      indexNext = arrResult.push(await deepCopyAsync(item));
      mapOriginal[key] = { key, hash, index };
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
function arrMergeSync (arrOriginal, arrUpdate, identifier) {
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
  let arrResult = [].concat(deepCopySync(arrOriginal));
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
    let hash = hashObjectSync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {}
    }
    mapOriginal[key] = { key, hash, index };
  }

  // scan arrUpdate
  let indexNext = arrResult.length;
  for (let item of arrUpdate) {
    let hash = hashObjectSync(item);
    let key = hash; // default case identifierAbsent
    if (identifierIsStr) {
      key = item[identifier];
    }
    if (identifierIsFunc) {
      try {
        key = identifier(item);
      } catch (error) {}
    }
    if (mapOriginal[key]) { // item exists in arrOriginal
      if (mapOriginal[key].hash !== hash) { // need update
        let index = mapOriginal[key].index;
        arrResult[index] = deepCopySync(item);
        mapOriginal[key] = { key, hash, index };
      }
    } else { // need append new item
      let index = indexNext;
      indexNext = arrResult.push(deepCopySync(item));
      mapOriginal[key] = { key, hash, index };
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
function arrMerge (arrOriginal, arrUpdate, identifier) {
  return arrMergeSync (arrOriginal, arrUpdate, identifier)
}

module.exports = { arrMergeAsync, arrMergeSync, arrMerge };