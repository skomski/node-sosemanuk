var Benchmark = require('benchmark');
var sosemanuk = require('..')

var suite = new Benchmark.Suite;

suite.add('init', function(deferred) {
  sosemanuk.createCipher(new Buffer('1234'), new Buffer('1234'), function(err, cipher) {
    deferred.resolve();
  });
}, { defer: true, minSamples: 2000, maxTime: 30 });

suite.add('initSync', function(deferred) {
  var cipher = sosemanuk.createCipherSync(new Buffer('1234'), new Buffer('1234'));
  deferred.resolve();
},{ defer: true, minSamples: 2000, maxTime: 30 });

suite.on('cycle', function(event, bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: false });
