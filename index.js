'use strict';

const md5 = require('md5');

/**
 * Deep copy
 *
 * @param item
 * @returns {*}
 */
function deepCopy (item) {
  let copy = null;
  try {
    let str = JSON.stringify(item);
    copy = JSON.parse(str);
  } catch (e) {
    copy = item; // item has circ refs, do not use deep copy
  }
  return copy;
}

/**
 * Merge two array of objects
 *
 * @param arrOriginal - original array
 * @param arrUpdate - array for update
 * @param identifier - field or function for object matching (optional)
 * @returns {*[]}
 */
function arrMerge (arrOriginal, arrUpdate, identifier) {
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

  // start
  let arrResult = [].concat(deepCopy(arrOriginal));
  let mapOriginal = {};


  if (!Array.isArray(arrUpdate)) {
    arrResult.push(arrUpdate);
    return arrResult;
  }

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
    let str;
    try {
      str = JSON.stringify(item);
    } catch (error) {
      str = '0';
    }
    let hash = md5(str);
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
    let str;
    try {
      str = JSON.stringify(item);
    } catch (error) {
      str = '0';
    }
    let hash = md5(str);
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
        arrResult[index] = deepCopy(item);
        mapOriginal[key] = { key, hash, index };
      }
    } else { // need append new item
      let index = indexNext;
      indexNext = arrResult.push(deepCopy(item));
      mapOriginal[key] = { key, hash, index };
    }
  }

  return arrResult;
}

module.exports = { arrMerge };