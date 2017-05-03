/**
 * Load environment variables
 */
const fs = require("fs");
const dotenv = require('dotenv').config();
const config = require('nconf').file({ file: './config/configuration.json' });

/**
 * Load necessary modules
 */
const host = 'Server running at PORT :' + process.env.PORT;
const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();

const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Bind middlewares
 */
const middleware = require('./middleware')(router, config);
app.use('/api', router);

/**
 * Get app API routes
 */
fs.readdirSync('./api').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    apiGroup = require('./api/' + file);
    apiGroup.routes(router, config);
  }
});

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  if (req.url.substr(0, 4) === '/api') {
    // set locals, only providing error in development
    res.locals.message = process.env.NODE_ENV === 'development' ? err.message : 'something bad happened :(';
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    // console.log(res.locals.message);
    // console.log(res.locals.error);

    // send error message
    res.status(err.status || 500).json({ message: res.locals.message, error: res.locals.error });
  } else {
    next()
  }
});

app.use('/', express.static(__dirname + '/public'));
app.get('/*', function (request, response, next) {
  response.sendFile('index.html', { root: __dirname + '/public' });
})

var server = app.listen(process.env.PORT, function () {
  console.log(host);

  /**
   * Connect to the database
   */
  require('./libs/dbconnection')(mongoose).then(function (log) {
    console.log(log);

    var io = require('socket.io').listen(server);
    var socket = require('./libs/sockets').init(io);

    //populate status collections
    //require('./libs/status')(config.get('statuses'));

  }, function (log) { //on error
    console.log(log);
  });

})