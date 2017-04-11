var people = {};

module.exports.init = function(socket) {

  socket.on('connection', function(client) {

    client.on("join", function(name) {
      people[client.id] = name;
      socket.sockets.emit("update", name + " has connected to the server.");
      console.log(people[client.id] + " has joined the server.");
      socket.sockets.emit("update-people", people);
    });

    client.on("send", function(msg) {
      socket.sockets.emit("chat", people[client.id], msg);
      socket.sockets.emit("update", people[client.id] + " sent: " + JSON.stringify(msg));
      console.log(people[client.id] + " sent: " + JSON.stringify(msg));
    });

    client.on("disconnect", function() {
      socket.sockets.emit("update", people[client.id] + " has left the server.");
      console.log(people[client.id] + " has left the server.");
      delete people[client.id];
      socket.sockets.emit("update-people", people);
    });

  })

}