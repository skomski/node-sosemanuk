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
    sosemanuk.createCipher();
  },
  /undefined/
);
sosemanuk.createCipher('', '', function(err) {
  assert.equal(err.message, '`key` != type(Buffer)');
});
sosemanuk.createCipher(new Buffer('2'), '', function(err) {
  assert.equal(err.message, '`key` != (16 >= && <= 32 bytes)');
});
sosemanuk.createCipher(testKey, '', function(err) {
  assert.equal(err.message, '`iv` != type(Buffer)');
});
sosemanuk.createCipher(testKey, new Buffer('2'), function(err) {
  assert.equal(err.message, '`iv` != (16 bytes)');
});

var cipher = sosemanuk.createCipherSync(testKey, testIv);
cipher.encrypt(2, function(err) {
  assert.equal(err.message, 'args[0] != type(Buffer)');
});


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
