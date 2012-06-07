var sosemanuk = require('..');
var assert = require('assert');
var fs     = require('fs');
var crypto = require('crypto');

var tests = 0;
var testKey = crypto.randomBytes(32);
var testIv  = crypto.randomBytes(16);
var testBuffer = fs.readFileSync(__dirname + '/urls.10K');

var cipher = sosemanuk.createCipherSync(testKey, testIv);
var encrypted = cipher.encryptSync(testBuffer);

var cipher = sosemanuk.createCipherSync(testKey, testIv);
var decrypted = cipher.encryptSync(encrypted);

assert.deepEqual(testBuffer, decrypted);

tests = 1;


process.on('exit', function() {
  assert.equal(tests, 1);
});
