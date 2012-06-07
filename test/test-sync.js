var sosemanuk = require('..');
var assert = require('assert');
var fs     = require('fs');

var tests = 0;
var testKey = '12345678901234567890';
var testIv  = '1234567890123456';
var testBuffer = fs.readFileSync(__dirname + '/urls.10K');

var cipher = sosemanuk.createCipherSync(new Buffer(testKey), new Buffer(testIv));
var encrypted = cipher.encryptSync(testBuffer);

var cipher = sosemanuk.createCipherSync(new Buffer(testKey), new Buffer(testIv));
var decrypted = cipher.encryptSync(encrypted);

assert.deepEqual(testBuffer, decrypted);

tests = 1;


process.on('exit', function() {
  assert.equal(tests, 1);
});
