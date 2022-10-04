'use strict';
const {arrMergeAsync, arrMergeSync} = require("../index");

function deepCopy(item) {
  let copy = null;
  try {
    let str = JSON.stringify(item);
    copy = JSON.parse(str);
  } catch (e) {
    copy = item; // item has circ refs, do not use deep copy
  }
  return copy;
}

function identifier(item) {
  return `${item.key}${item.child.key}`;
}

function after(arr1, arr2) {
  arr1[0].value = 'AA';
  arr2[1].value = 'DD';
}

let testSet = [
  {
    name: 'test 1',
    description: 'Simple arrays; no identifier.',
    arr1: [1, 2, 3],
    arr2: [3, 4, 5],
    identifier: null,
    expect: [1, 2, 3, 4, 5]
  },
  {
    name: 'test 2',
    description: 'Objects arrays; identifier as string; updating old values.',
    arr1: [{id: 1, value: 'A'}, {id: 2, value: 'B'}],
    arr2: [{id: 2, value: 'C'}, {id: 3, value: 'D'}],
    identifier: 'id',
    expect: [{id: 1, value: 'A'}, {id: 2, value: 'C'}, {id: 3, value: 'D'}]
  },
  {
    name: 'test 3',
    description: 'Objects arrays; identifier as string; update object structure.',
    arr1: [{id: 1, value: 'A'}, {id: 2, value: 'B'}],
    arr2: [{id: 2}, {id: 3, value: 'D'}],
    identifier: 'id',
    expect: [{id: 1, value: 'A'}, {id: 2}, {id: 3, value: 'D'}]
  },
  {
    name: 'test 4',
    description: 'Objects arrays; no identifier.',
    arr1: [{value: 'A', text: 'text-A'}, {value: 'B', key: 42}],
    arr2: [{value: 'B', key: 42}, {value: 'D'}],
    identifier: null,
    expect: [{value: 'A', text: 'text-A'}, {value: 'B', key: 42}, {value: 'D'}]
  },
  {
    name: 'test 5',
    description: 'Objects arrays; identifier as function.',
    arr1: [{key: 'A', text: 'text-A', child: {key: 'A'}}, {key: 'A', text: 'text-B', child: {key: 'B'}}],
    arr2: [{key: 'A', text: 'text-C', child: {key: 'B'}}, {key: 'B', text: 'text-D', child: {key: 'A'}}],
    identifierAsFunc: true,
    expect: [{key: 'A', text: 'text-A', child: {key: 'A'}}, {key: 'A', text: 'text-C', child: {key: 'B'}}, {
      key: 'B',
      text: 'text-D',
      child: {key: 'A'}
    }]
  },
  {
    name: 'test 6',
    description: 'Objects arrays; result array has objects copies.',
    arr1: [{id: 1, value: 'A'}, {id: 2, value: 'B'}],
    arr2: [{id: 2, value: 'C'}, {id: 3, value: 'D'}],
    identifier: 'id',
    after: true,
    expect: [{id: 1, value: 'A'}, {id: 2, value: 'C'}, {id: 3, value: 'D'}]
  },
  {
    name: 'test E1',
    description: 'Test of errors; (null, null)',
    arr1: null,
    arr2: null,
    identifier: null,
    expect: []
  },
  {
    name: 'test E3',
    description: 'Test of errors; (7, null)',
    arr1: 7,
    arr2: null,
    identifier: null,
    expect: [7]
  },
  {
    name: 'test E2',
    description: 'Test of errors; (null, 8)',
    arr1: null,
    arr2: 8,
    identifier: null,
    expect: [8]
  },
  {
    name: 'test E3',
    description: 'Test of errors; (7, 8)',
    arr1: 7,
    arr2: 8,
    identifier: null,
    expect: [7, 8]
  },
];

describe('Sync tests', () => {
  let testSetSync = deepCopy(testSet);
  for (let item of testSetSync) {
    test(item.name, () => {
      if (item.identifierAsFunc) {
        item.identifier = identifier;
      }
      let merged = arrMergeSync(item.arr1, item.arr2, item.identifier);
      if (item.after) {
        after(item.arr1, item.arr2);
      }
      expect(merged.sort()).toEqual(item.expect.sort());
    });
  }  
})

describe('Async tests', () => {
  let testSetAsync = deepCopy(testSet);
  for (let item of testSetAsync) {
    test(item.name, async () => {
      if (item.identifierAsFunc) {
        item.identifier = identifier;
      }
      let merged = await arrMergeAsync(item.arr1, item.arr2, item.identifier);
      if (item.after) {
        after(item.arr1, item.arr2);
      }
      expect(merged.sort()).toEqual(item.expect.sort());
    });
  }
})
