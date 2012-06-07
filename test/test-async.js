var sosemanuk = require('..');
var assert = require('assert');
var fs     = require('fs');

var tests = 0;
var testKey = '12345678901234567890';
var testIv  = '1234567890123456';
var testBuffer = fs.readFileSync(__dirname + '/urls.10K');

sosemanuk.createCipher(new Buffer(testKey), new Buffer(testIv), function(err, cipher) {
  assert.ifError(err);

  var testString = '1234';

  var encrypted = cipher.encrypt(testBuffer, function(err, encrypted) {
    assert.ifError(err);

    sosemanuk.createCipher(new Buffer(testKey), new Buffer(testIv), function(err, cipher) {
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
