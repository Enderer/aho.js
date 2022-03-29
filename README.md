# Aho.js
Aho.js is a node module that can be used to find matching patterns in a string.  It is useful for scenarios where you need to search a string for known patterns when the number of possible patterns is very large.  It uses the algorithm originally described in the paper [Efficient String Matching - An Aid to Bibliographic Search](https://github.com/tpn/pdfs/blob/master/Efficient%20String%20Matching%20-%20An%20Aid%20to%20Bibliographic%20Search%20-%20Aho-Corasick%20(1975).pdf) by Alfred Aho and Margaret Corasick.

## Install
```
npm install aho.js
```

## Usage
### Search for matches
```javascript
import { createRoot, addPattern, buildAho, findPatterns } from 'aho.js';

const patterns = ['he', 'she', 'his', 'hers'];

// Create the search trie
const root = createRoot();
patterns.forEach(p => addPattern(root, p));
const built = buildAho(root);

// Look for matches
const matches = findPatterns(built, 'ushers');
// ['she', 'he', 'hers']
```

### Search async text
It is possible to search for patterns in an asynchronous string using the ```findPatternsAsync ``` method. This can be useful for processing very large bodies of text without the need to load it entirely into memory.
```javascript
// Load chars as an AsyncIterable
const asyncChars = getAsyncChars(...); // AsyncIterable<string>

// Get an async list of matches
const matches = findPatternsAsync(built, asyncChars);
for await(const match of matches) {
  console.log(JSON.stringify(match));
}
```

### Search tokens
Search on a tokenized list of words instead of at the character level

```typescript
const phrases = ['one two three', 'four five six'];
const patterns = phrases.map(p => p.split(' '))
// [['one', 'two', 'three'], ['four', 'five', 'six']]

const root = createRoot();
patterns.forEach(p => addPattern(root, p));
const built = buildAho(root);
const tokenizedText = 'zero one two three four'.split(' ');
const matches = findPatterns(built, tokenizedText);
// [['one', 'two', 'three']]
```

### Search non-char patterns
You can search for patterns in data other than strings. Any ```Iterable``` can be used.  A common scenario for this is to convert tokenized words into numbers using a vocabulary to improve performance.

```javascript
const patterns = [
  ['blessing', 'in', 'disguise'],
  ['on', 'the', 'ball'],
  ['under', 'the', 'weather']
].map(p => p.map(w => vocab.toId(w)));
// [
//   [122, 34, 632],
//   [22, 434, 233],
//   [2, 14, 56]
// ]

const root = createRoot();
patterns.forEach(s => addPattern(root, s));
const built = buildAho(root);
const tokenizedText = ['this', 'is', 'a' 'tokenized', 'string', ...];
const tokenizedIds = tokenizedText.map(t => vocab.toId(v));
const matches = findPatterns(built, tokenizedIds);
// [[122, 34, 632], [2, 14, 56]]

const phraseMatches = matches.map(p => vocab.toToken(p));
// [['blessing', 'in', 'disguise'], ['under', 'the', 'weather']]

```

## Pre-compute trie
The entire aho corasick algorithm runs in O(n + m + z) where:
```
n = length of all patterns in dictionary
m = length of text being searched
z = length of all matches found
```
When the size of the dictionary being matched against is very large ```(n is much larger than m, z)``` most of the time will be spent building the search trie.  You can pre-compute this tree and save it to disk to speed up processing.
```javascript
const fs = require('fs');

// Save the trie
fs.writeFileSync(path, JSON.stringify(built));

// Load the trie
const loadedTrie = JSON.parse(fs.readFileSync(path, 'utf8'));
const matches = findPatterns(loadedTrie, 'ushers');
// ['she', 'he', 'hers']
```

## Print the trie
You can print out a visualization of the structure of the trie using one of the following functions.

```javascript
const root = createRoot();
const patterns = ['he', 'she', 'his', 'hers'];
patterns.forEach(p => addPattern(root, p));
const built = buildAho(root);

console.log(printToString(built));           // Print to a string
printToStream(built).pipe(process.stdout);   // Print to a stream
// [] ^
//  [h] ^
//    [e]* ^
//      [r] ^
//        [s]* ^s
//    [i] ^
//      [s]* ^s
//  [s] ^
//    [h] ^h
//      [e]* ^he

// [h]* ^fallback
// where
// [h]       = value of the token at this node
// *         = indicates a pattern matches on this node
// ^         = root node
// fallback  = path of the node to fallback to
```

## Typescript
This module is written in Typescript and compiled to ES5.

```typescript
import { Root, createRoot, addPattern, buildAho, findPatterns } from 'aho.js';

const root: Root<number> = createRoot<number>();
const patterns = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
patterns.forEach(p => addPattern(root, p));
const built = buildAho(root);
const matches = findPatterns(built, [2, 3, 4, 5, 6, 7]);
// [[4, 5, 6]]
```