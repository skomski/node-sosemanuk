var sosemanuk;

try {
  sosemanuk = require('../build/default/binding');
} catch(e) {
  sosemanuk = require('../build/Release/binding');
}

exports.createCipherSync = function(key, iv) {
  if(!Buffer.isBuffer(key)) {
    throw new Error('`key` != type buffer');
  }
  if(key.length < 16 || key.length > 32) {
    throw new Error('`key` != (16 >= && <= 32 bytes)');
  }
  if(!Buffer.isBuffer(iv)) {
    throw new Error('`iv` != type(buffer)');
  }
  if(iv.length != 16) {
    throw new Error('`iv` != (16 >= && <= 32 bytes)');
  }
  return sosemanuk.initSync(key, iv);
};

exports.createCipher = function(key, iv, cb) {
  if(!Buffer.isBuffer(key)) {
    return cb(new Error('`key` != type(Buffer)'));
  }
  if(key.length < 16 || key.length > 32) {
    return cb(new Error('`key` != (16 >= && <= 32 bytes)'));
  }
  if(!Buffer.isBuffer(iv)) {
    return cb(new Error('`iv` != type(Buffer)'));
  }
  if(iv.length != 16) {
    return cb(new Error('`iv` != (16 bytes)'));
  }
  return sosemanuk.init(key, iv, cb);
};
