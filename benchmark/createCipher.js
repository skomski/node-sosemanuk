var Benchmark = require('benchmark');
var sosemanuk = require('..');
var crypto = require('crypto');

var testKey = crypto.randomBytes(32);
var testIv  = crypto.randomBytes(16);

var suite = new Benchmark.Suite;

suite.add('init', function(deferred) {
  sosemanuk.createCipher(testKey, testIv, function(err, cipher) {
    deferred.resolve();
  });
}, { defer: true, maxTime: 30 });

suite.add('initSync', function() {
  sosemanuk.createCipherSync(testKey, testIv);
},{ maxTime: 30 });

suite.on('cycle', function(event, bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: false });
