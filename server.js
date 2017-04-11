
const port = 1111;
const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/public'));
app.get('/*', function (request, response, next) {
  response.sendFile('index.html', { root: __dirname + '/public' });
})

var server = app.listen(port, function () {
  console.log('Server running on PORT: ' + port);
  var io = require('socket.io').listen(server);
  var socket = require('./libs/sockets').init(io);
})
