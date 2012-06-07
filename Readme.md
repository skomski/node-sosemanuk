This is a fork of kesla's node-snappy. Simple async binding and no more :)

# node-snappy [![Build Status](https://secure.travis-ci.org/Skomski/node-snappy.png?branch=master)](http://travis-ci.org/Skomski/node-snappy)

Node.js bindings for Google's fast compressor/decompressor: <http://code.google.com/p/snappy/>

## Install

```
npm install https://github.com/Skomski/node-snappy/tarball/v1.4.2
```

## Simple Benchmark

```
Testfile:
  https://raw.github.com/Skomski/node-snappy/master/test/urls.10K
  size: 702087 bytes

Compression:
  snappy: 357267 bytes
  zlib(level:1): 253263 bytes

Speed:
  zlib x 68.30 ops/sec ±1.52% (56 runs sampled)
  snappy x 361 ops/sec ±0.94% (61 runs sampled)
```

## Usage

```javascript

var Snappy = require('snappy');
var buffer = new Buffer('yyyyyyyyyyyyyyyyyyy');

Snappy.compress(buffer, function(err, compressed){
  if (err) throw err;

  Snappy.decompress(compressed, function(err, decompressed){
    if (err) throw err;
  });
});
```

## Methods

### compress(buffer, cb)
  * Required:
    * `buffer` - Raw buffer
    * `cb` - Function with two arguments `(err, compressedBuffer)`

### decompress(buffer, cb)
  * Required:
    * `buffer` - Compressed buffer
    * `cb` - Function with two arguments `(err, decompressedBuffer)`

## License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to http://unlicense.org/
