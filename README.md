### Merge two array of objects
Arrays, not objects are being merged. 
Objects with matching identifiers are replaced.
Objects deep copies are placing into result array. 
To merge, you can select an object field as an identifier. 
Without identifier objects will be compared by md5 hash.
You can use callback function to calc object identifier.

There are sync and async function versions.

#### Example 1
Simple arrays; no identifier. 
```js
const { arrMergeSync } = require('merge-arrays-of-objects');

let original = [1, 2, 3];
let update = [3, 4, 5];
let merged = arrMergeSync(original, update);

console.log(merged); 
// [1, 2, 3, 4, 5]
```

#### Example 2
Objects arrays; identifier as number; updating old values;
```js
const { arrMergeSync } = require('merge-arrays-of-objects');

let original = [
  {id:1, value:'A'}, 
  {id:2, value:'B'}
];

let update = [
  {id:2, value:'C'}, 
  {id:3, value:'D'}
];

let merged = arrMergeSync(original, update, 'id');

console.log(merged);
// [ { id: 1, value: 'A' },
//   { id: 2, value: 'C' },
//   { id: 3, value: 'D' } ]
```

#### Example 3
Objects arrays; identifier as number; update object structure.
```js
const { arrMergeSync } = require('merge-arrays-of-objects');

let original = [
  {id:1, value:'A'}, 
  {id:2, value:'B'}
];

let update = [
  {id:2}, 
  {id:3, value:'D'}
];

let merged = arrMergeSync(original, update, 'id');

console.log(merged); 
// [ { id:1, value:'A' }, 
//   { id:2 }, 
//   { id:3, value:'D' } ]
```

#### Example 4
Objects arrays; no identifiers.
```js
const { arrMergeSync } = require('merge-arrays-of-objects');

let original = [
  {value:'A', text:'text-A'}, 
  {value:'B', key:42}
];

let update = [
  {value:'B', key:42}, 
  {value:'D'}
];

let merged = arrMergeSync(original, update);

console.log(merged); 
// [ { value:'A', text:'text-A' }, 
//   { value:'B', key:42 }, 
//   { value:'D'} ]
```

#### Example 5
Objects arrays; identifier as function.
```js
const { arrMergeSync } = require('merge-arrays-of-objects');

let original = [
    {key:'A', text:'text-A', child: {key: 'A'}}, 
    {key:'A', text:'text-B', child: {key: 'B'}}
  ];
  
let update = [
    {key:'A', text:'text-C', child: {key: 'B'}}, 
    {key:'B', text:'text-D', child: {key: 'A'}}
  ];

function key(item) {
    return `${item.key}${item.child.key}`;
}  
  
let merged = arrMergeSync(original, update, key);

console.log(merged);
// [ { key: 'A', text: 'text-A', child: { key: 'A' } },
//   { key: 'A', text: 'text-C', child: { key: 'B' } },
//   { key: 'B', text: 'text-D', child: { key: 'A' } } ]
```

#### Example 6
Objects arrays; result array has objects copies.
```js
const { arrMergeSync } = require('merge-arrays-of-objects');

let original = [
  {id:1, value:'A'},
  {id:2, value:'B'}
];

let update = [
  {id:2, value:'C'},
  {id:3, value:'D'}
];

let merged = arrMergeSync(original, update, 'id');

original[0].value = 'AA';
update[1].value = 'DD';

console.log(merged);
// [ { id: 1, value: 'A' },
//   { id: 2, value: 'C' },
//   { id: 3, value: 'D' } ]
```

#### Example 7
Objects arrays; async version.
```js
const { arrMergeAsync } = require('merge-arrays-of-objects');

async function test () {
  try {
    let original = [
      {id: 1, value: 'A'},
      {id: 2, value: 'B'}
    ];

    let update = [
      {id: 2, value: 'C'},
      {id: 3, value: 'D'}
    ];

    let merged = await arrMergeAsync(original, update, 'id');
    console.log(merged);
  } catch (error) {
    console.error(error.message);
  }
}

test().then(()=>{});
// [ { id: 1, value: 'A' },
//   { id: 2, value: 'C' },
//   { id: 3, value: 'D' } ]
```
