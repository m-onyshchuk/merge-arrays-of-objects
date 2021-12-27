### Merge two array of objects
To merge you need setup object identifier to compare two objects. 
Without identifier objects will be compared by md5 hash.

#### Example 1
Simple arrays; no identifier. 
```js
const { arrMerge } = require('merge-arrays-of-objects');

let original = [1, 2, 3];
let update = [3, 4, 5];
let merged = arrMerge(original, update);

console.log(merged); 
// [1, 2, 3, 4, 5]
```

#### Example 2
Objects arrays; identifier as string; updating old values;
```js
const { arrMerge } = require('merge-arrays-of-objects');

let original = [
  {id:1, value:'A'}, 
  {id:2, value:'B'}
];

let update = [
  {id:2, value:'C'}, 
  {id:3, value:'D'}
];

let merged = arrMerge(original, update, 'id');

console.log(merged);
// [ { id: 1, value: 'A' },
//   { id: 2, value: 'C' },
//   { id: 3, value: 'D' } ]
```

#### Example 3
Objects arrays; identifier as string; update object structure.
```js
const { arrMerge } = require('merge-arrays-of-objects');

let original = [
  {id:1, value:'A'}, 
  {id:2, value:'B'}
];

let update = [
  {id:2}, 
  {id:3, value:'D'}
];

let merged = arrMerge(original, update, 'id');

console.log(merged); 
// [ { id:1, value:'A' }, 
//   { id:2 }, 
//   { id:3, value:'D' } ]
```

#### Example 4
Objects arrays; no identifier.
```js
const { arrMerge } = require('merge-arrays-of-objects');

let original = [
  {value:'A', text:'text-A'}, 
  {value:'B', key:42}
];

let update = [
  {value:'B', key:42}, 
  {value:'D'}
];

let merged = arrMerge(original, update);

console.log(merged); 
// [ { value:'A', text:'text-A' }, 
//   { value:'B', key:42 }, 
//   { value:'D'} ]
```

#### Example 5
Objects arrays; identifier as function.
```js
const { arrMerge } = require('merge-arrays-of-objects');

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
  
let merged = arrMerge(original, update, key);

console.log(merged);
// [ { key: 'A', text: 'text-A', child: { key: 'A' } },
//   { key: 'A', text: 'text-C', child: { key: 'B' } },
//   { key: 'B', text: 'text-D', child: { key: 'A' } } ]
```
