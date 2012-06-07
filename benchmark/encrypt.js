var Benchmark = require('benchmark');
var sosemanuk = require('..')
var fs = require('fs');
var crypto = require('crypto');

var suite = new Benchmark.Suite;

var testKey = crypto.randomBytes(32);
var testIv  = crypto.randomBytes(16);
var cipher = sosemanuk.createCipherSync(testKey, testIv);

var buffer = fs.readFileSync(__dirname + '/../test/urls.10K');

suite.add('encrypt', function(deferred) {
  cipher.encrypt(buffer, function(err, encrypted) {
    deferred.resolve();
  });
}, { defer: true, maxTime: 30 });

suite.add('encryptSync', function() {
  var encrypted = cipher.encryptSync(buffer);
},{ maxTime: 30 });

suite.on('cycle', function(event, bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: false });
