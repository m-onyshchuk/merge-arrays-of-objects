### Merge two array of objects
To merge you need setup object key (identifier) to compare two objects. 
Without key object will be compared by md5 hash.

#### Example 1
Simple data, no identifier. 
```
let original = [1, 2, 3];
let update = [3, 4, 5];
let merged = arrMerge(original, update);
console.log(merged); 
// [1, 2, 3, 4, 5]
```

#### Example 2
Objects array, identifier as string.
```
let original = [{id:1, value:'A'}, {id:2, value:'B'}];
let update = [{id:2, value:'B'}, {id:3, value:'C'}];
let merged = arrMerge(original, update, 'id');
console.log(merged); 
// [{id:1, value:'A'}, {id:2, value:'B'}, {id:3, value:'C'}]
```