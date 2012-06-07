var Benchmark = require('benchmark');
var sosemanuk = require('..')
var fs = require('fs');

var suite = new Benchmark.Suite;

var testKey = '12345678901234567890';
var testIv  = '1234567890123456';
var cipher = sosemanuk.createCipherSync(new Buffer(testKey), new Buffer(testIv));

var buffer = fs.readFileSync(__dirname + '/../test/urls.10K');

suite.add('encrypt', function(deferred) {
  cipher.encrypt(buffer, function(err, encrypted) {
    deferred.resolve();
  });
}, { defer: true, minSamples: 2000, maxTime: 30 });

suite.add('encryptSync', function(deferred) {
  var encrypted = cipher.encryptSync(buffer);
  deferred.resolve();
},{ defer: true, minSamples: 2000, maxTime: 30 });

suite.on('cycle', function(event, bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: false });
