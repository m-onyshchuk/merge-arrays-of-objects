const { arrMerge } = require('./index');
const md5 = require('md5');

function check(arr1, arr2) {
  let hash1 = md5(JSON.stringify(arr1));
  let hash2 = md5(JSON.stringify(arr2));
  return hash1 === hash2 ? 'OK' : 'Failed';
}

let testSet = [
  {
    name: 'test 1',
    arr1: [1, 2, 3],
    arr2: [3, 4, 5],
    identifier: null,
    expect: [1, 2, 3, 4, 5]
  },
  {
    name: 'test 2',
    arr1: [{id:1, value:'A'}, {id:2, value:'B'}],
    arr2: [{id:2, value:'B'}, {id:3, value:'C'}],
    identifier: 'id',
    expect: [{id:1, value:'A'}, {id:2, value:'B'}, {id:3, value:'C'}]
  },

];

console.log('=== test start ===');
console.log('');

for (let test of testSet) {
  console.log(`--- ${test.name} ---`);
  console.log('arr1: ', test.arr1);
  console.log('arr2: ', test.arr2);
  console.log('expect: ', test.expect);
  let merged = arrMerge(test.arr1, test.arr2, test.identifier);
  console.log('merge:  ', merged);
  console.log('result: ', check(test.expect, merged));
  console.log('');
}

console.log('=== test end ===');