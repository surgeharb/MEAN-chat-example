var people = {};

//Models
const users = require('../models/users');

//Utils
const jsonToken = require('./token.js');

module.exports.init = function (socket) {

  socket.on('connection', function (client) {

    client.on("authenticate", function (token, username) {
      jsonToken.verify(token, 'socket')
        .then(function (response) {
          if (response.message === 'verified') {
            socket.sockets.emit("auth", true);
          } else {
            socket.sockets.emit("auth", false);
          }
        }).catch(function () {
          socket.sockets.emit("auth", false);
        })
    })

    client.on("join", function (name) {
      people[client.id] = name;
      socket.sockets.emit("update", name + " has connected to the server.");
      console.log(people[client.id] + " has joined the server.");
      socket.sockets.emit("update-people", people);
    });

    client.on("send", function (msg) {
      socket.sockets.emit("chat", people[client.id], msg);
      socket.sockets.emit("update", people[client.id] + " sent: " + JSON.stringify(msg));
      socket.sockets.emit("receive", msg);
      console.log(msg);
    });

    client.on("disconnect", function (reason) {
      if (people[client.id] != undefined) {
        socket.sockets.emit("update", people[client.id] + " has left the server.");
        console.log(people[client.id] + " has left the server.");
        delete people[client.id];
        socket.sockets.emit("update-people", people);
      }
    });

  })

}