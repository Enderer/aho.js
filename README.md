# Aho.js
This is a node module can be used to find matching patterns in a string.  It is useful for scenarios where you need to search a string for known patterns when the number of possible patterns is very large.  It uses the algorithm origionally described in the paper [Efficient String Matching - An Aid to Bibliographic Search](https://github.com/tpn/pdfs/blob/master/Efficient%20String%20Matching%20-%20An%20Aid%20to%20Bibliographic%20Search%20-%20Aho-Corasick%20(1975).pdf) by Alfred Aho and Margaret Corasick.

## Install
```
npm install aho.js
```

## Usage
### Search for matches
```javascript
import { createRoot, addPattern, buildAho, findPatterns } from 'aho.js';

const root = createRoot();
const patterns = ['he', 'she', 'his', 'hers'];
patterns.forEach(s => addPattern(root, s));
const built = buildAho(root);
const matches = findPatterns(built, 'ushers');
// ['she', 'he', 'hers']
```

### Search async text
It is possible to search for patterns in an asycnronous string using the ```findPatternsAsync ``` method. This can be useful for processing very large bodies of text without the need to load it entirely into memory.
```javascript
// Load chars as an AsyncIterable
const asyncChars: AsyncIterable<string> = getAsyncChars(...);

// Get an async list of matches
const matches = findPatterns(built, asyncChars);
for await(const match of matches) {
  console.log(JSON.stringify(match));
}
```

### Search word tokens
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
You can search for patterns in data other than strings. Any ```Iterable``` data can be used.  A common scenario for this is to convert tokenized words into numbers using a vocabulary to improve performance.

```javascript
const phrases = [
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

const phraseMatches = mathes.map(p => vocab.toToken(p));
// [['blessing', 'in', 'disguise'], ['under', 'the', 'weather']]

```

## Pre-compute trie
The entire aho corasick algorithm runs in O(n + m + z) where:
```
n = length of all patterns in dictionary
m = length of text being searched
z = length of all matches found
```
When the size of the dictionary being matched against is very large ```(n is much larger than m, z)``` most of the time will be spent buiding the search trie.  You can pre-compute this tree and save it to disk to speed up processing.
```javascript
import { createRoot, addPattern, buildAho, findPatterns } from 'aho.js';

// Build the trie
const root = createRoot();
const patterns = loadPatterns();
patterns.forEach(s => addPattern(root, s));
const built = buildAho(root);

// Save the trie
const fs = require('fs');
fs.writeFileSync(path, JSON.stringify(built));

// Load the trie
const loadedTrie = JSON.parse(fs.readFileSync(path, 'utf8'));
const matches = findPatterns(loadedTrie, 'ushers');
// ['she', 'he', 'hers']
```


## Typescript
This module is built using typescript and compiled into ES5.

```typescript
import { Root, createRoot, addPattern, buildAho, findPatterns } from 'aho.js';

const root: Root<number> = createRoot<number>();
const patterns = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
patterns.forEach(p => addPattern(root, p));
const built: Root<number> = buildAho(root);
const matches = findPatterns(built, [2, 3, 4, 5, 6, 7]);
// [[1, 2, 3]]
```