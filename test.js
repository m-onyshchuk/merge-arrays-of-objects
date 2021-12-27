const { arrMerge } = require('./index');
const md5 = require('md5');

function check(arr1, arr2) {
  let hash1 = md5(JSON.stringify(arr1));
  let hash2 = md5(JSON.stringify(arr2));
  return hash1 === hash2 ? 'OK' : 'Failed';
}

let testSet = [
  {
    name: 'Test 1',
    description: 'Simple arrays; no identifier.',
    arr1: [1, 2, 3],
    arr2: [3, 4, 5],
    identifier: null,
    expect: [1, 2, 3, 4, 5]
  },
  {
    name: 'Test 2',
    description: 'Objects arrays; identifier as string; updating old values.',
    arr1: [{id:1, value:'A'}, {id:2, value:'B'}],
    arr2: [{id:2, value:'C'}, {id:3, value:'D'}],
    identifier: 'id',
    expect: [{id:1, value:'A'}, {id:2, value:'C'}, {id:3, value:'D'}]
  },
  {
    name: 'Test 3',
    description: 'Objects arrays; identifier as string; update object structure.',
    arr1: [{id:1, value:'A'}, {id:2, value:'B'}],
    arr2: [{id:2}, {id:3, value:'D'}],
    identifier: 'id',
    expect: [{id:1, value:'A'}, {id:2}, {id:3, value:'D'}]
  },
  {
    name: 'Test 4',
    description: 'Objects arrays; no identifier.',
    arr1: [{value:'A', text:'text-A'}, {value:'B', key:42}],
    arr2: [{value:'B', key:42}, {value:'D'}],
    identifier: null,
    expect: [{value:'A', text:'text-A'}, {value:'B', key:42}, {value:'D'}]
  },
  {
    name: 'Test 5',
    description: 'Objects arrays; identifier as function.',
    arr1: [{key:'A', text:'text-A', child: {key: 'A'}}, {key:'A', text:'text-B', child: {key: 'B'}}],
    arr2: [{key:'A', text:'text-C', child: {key: 'B'}}, {key:'B', text:'text-D', child: {key: 'A'}}],
    identifier: item => `${item.key}${item.child.key}`,
    expect: [{key:'A', text:'text-A', child: {key: 'A'}}, {key:'A', text:'text-C', child: {key: 'B'}}, {key:'B', text:'text-D', child: {key: 'A'}}]
  },
];

console.log('==== test start ====');
console.log('');

let countOK = 0;
let countFailed = 0;
for (let test of testSet) {
  console.log(`---- ${test.name} ----`);
  console.log(test.description);
  console.log('arr1: ', test.arr1);
  console.log('arr2: ', test.arr2);
  console.log('expect: ', test.expect);
  let merged = arrMerge(test.arr1, test.arr2, test.identifier);
  console.log('merge:  ', merged);
  let result = check(test.expect, merged);
  if (result === 'OK') {
    countOK++;
  } else {
    countFailed++;
  }
  console.log('result: ', result);
  console.log('');
}

console.log(`OK: ${countOK}; Failed: ${countFailed};`);
console.log('==== test end ====');