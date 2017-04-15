const Q = require('q');

module.exports = function(mongoose) {
  var deferred = Q.defer();

  if (process.env.DB_USER === 'none' || process.env.DB_PASS === 'none') {
    var auth = '';
  } else {
    var auth = process.env.DB_USER + ':' + process.env.DB_PASS + '@';
  }

  const url = 'mongodb://' + auth + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;
  mongoose.Promise = global.Promise;
  mongoose.connect(url);
  var db = mongoose.connection;

  // mongoose.set('debug', true);

  db.on('error', function() {
    deferred.reject('Database connection error');
  });
  db.on('open', function() {
    deferred.resolve('Database connected successfully');
  });

  return deferred.promise;
}