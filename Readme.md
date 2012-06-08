# node-sosemanuk [![Build Status](https://secure.travis-ci.org/Skomski/node-sosemanuk.png?branch=unstable)](http://travis-ci.org/Skomski/node-sosemanuk)

node.js binding for sosemanuk (<http://www.ecrypt.eu.org/stream/e2-sosemanuk.html>)

## Install

```
npm install https://github.com/Skomski/node-sosemanuk
```

## Usage

```javascript

var sosemanuk = require('sosemanuk');
var crypto = require('crypto');

var key = crypto.randomBytes(32);
var iv  = crypto.randomBytes(16);
var buffer = new Buffer('yyyyyyyyyyyyyyyyyyy');

var cipher = sosemanuk.createCipherSync(key, iv);
var encrypted = cipher.encryptSync(buffer);

var decipher = sosemanuk.createCipherSync(key, iv);
var decrypted = decipher.encryptSync(buffer);

assert.deepEqual(buffer, decrypted);
```

## Methods


### createCipher(key, iv, cb)
  * Required:
    * `key` - Buffer(16 - 32 bytes)
    * `iv` - Buffer(16 bytes)
    * `cb` - Function with two arguments `(err, cipher)`

### createCipherSync(key, iv)
  * Required:
    * `key` - Buffer(16 - 32 bytes)
    * `iv` - Buffer(16 bytes)
  * Returns:
    * `cipher`

### cipher.encrypt(src, cb)
  * same for decrypt
  * Required:
    * `src` - Buffer
    * `cb` - Function with two arguments `(err, out)`

### cipher.encryptSync(src)
  * same for decrypt
  * Required:
    * `src` - Buffer
  * Returns:
    * `out`

## License

Copyright (c) 2012 Karl Skomski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
