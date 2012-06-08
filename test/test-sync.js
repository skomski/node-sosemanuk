var sosemanuk = require('..');
var assert = require('assert');
var fs     = require('fs');
var crypto = require('crypto');

var tests = 0;
var testKey = crypto.randomBytes(32);
var testIv  = crypto.randomBytes(16);
var testBuffer = fs.readFileSync(__dirname + '/urls.10K');

assert.throws(
  function() {
    sosemanuk.createCipherSync();
  },
  /`key` != type\(Buffer\)/
);

assert.throws(
  function() {
    sosemanuk.createCipherSync(new Buffer('2'));
  },
  /`key` != \(16 >= && <= 32 bytes\)/
);

assert.throws(
  function() {
    sosemanuk.createCipherSync(testKey);
  },
  /`iv` != type\(Buffer\)/
);

assert.throws(
  function() {
    sosemanuk.createCipherSync(testKey, new Buffer('2'));
  },
  /`iv` != \(16 >= && <= 32 bytes\)/
);

assert.throws(
  function() {
    var cipher = sosemanuk.createCipherSync(testKey, testIv);
    cipher.encryptSync();
  },
  /args.length != 1/
);

assert.throws(
  function() {
    var cipher = sosemanuk.createCipherSync(testKey, testIv);
    cipher.encryptSync('2');
  },
  /args\[0\] != type\(Buffer\)/
);

var cipher = sosemanuk.createCipherSync(testKey, testIv);
var encrypted = cipher.encryptSync(testBuffer);

var cipher = sosemanuk.createCipherSync(testKey, testIv);
var decrypted = cipher.encryptSync(encrypted);

assert.deepEqual(testBuffer, decrypted);

tests = 1;


process.on('exit', function() {
  assert.equal(tests, 1);
});
