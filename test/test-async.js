var sosemanuk = require('..');
var assert = require('assert');
var fs     = require('fs');
var crypto = require('crypto');

var tests = 0;
var testKey = crypto.randomBytes(32);
var testIv  = crypto.randomBytes(16);
var testBuffer = fs.readFileSync(__dirname + '/urls.10K');

sosemanuk.createCipher(testKey, testIv, function(err, cipher) {
  assert.ifError(err);

  cipher.encrypt(testBuffer, function(err, encrypted) {
    assert.ifError(err);

    sosemanuk.createCipher(testKey, testIv, function(err, cipher) {
      assert.ifError(err);

      cipher.encrypt(encrypted, function(err, decrypted) {
        assert.ifError(err);

        assert.deepEqual(testBuffer, decrypted);

        tests = 1;
      });
    });
  });
});



process.on('exit', function() {
  assert.equal(tests, 1);
});
