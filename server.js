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

/**
 * Connect to the database
 */
require('./libs/dbconnection')(mongoose).then(function(log) {
  console.log(log);

  //populate status collections
  //require('./libs/status')(config.get('statuses'));

}, function(log) { //on error
  console.log(log);
});

app.use('/', express.static(__dirname + '/public'));
app.get('/*', function(request, response, next) {
  response.sendFile('index.html', { root: __dirname + '/public' });
})

var server = app.listen(process.env.PORT, function() {
  console.log(host);
  var io = require('socket.io').listen(server);
  var socket = require('./libs/sockets').init(io);
})