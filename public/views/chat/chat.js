app.controller('ChatController', ['$scope', '$location', 'apiService', 'userService', function($scope, $location, apiService, userService) {

  $scope.user = userService.getUser();
  $scope.token = userService.getToken();

  var cedric_pp = "https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/10981992_854381584636591_4594131235025284689_n.jpg?oh=0177b6d4c5e300a93cfa20de639bd235&oe=592BF9D9";
  var serge_pp = "http://files.sergeharb.com/img/Me.jpg";

  var socket = io.connect('http://localhost:9000');
  socket.on("connect", function() {
    socket.emit("authenticate", { token: myAuthToken });
  })

  socket.on("auth", function() {
    socket.emit("join", $scope.user.username);
    socket.on("update", function(msg) {
      console.log(msg);
    });

    socket.on("receive", function(data) {
      if (data.sender == $scope.user.username) {
        $scope.conversations[data.receiver].push(data);
        $scope.$apply();
      } else {
        if (data.receiver != $scope.user.username) return false;
        $scope.conversations[data.sender].push(data);
        $scope.$apply();
      }
    })
  })

  $scope.conversations = {};
  if ($scope.user.username == 'cedric') {
    $scope.chatConversations = [{
      "_id": "123456789abd",
      "name": "Serge Harb",
      "username": "surgeharb",
      "profilePicture": serge_pp,
      "lastmessage": {
        "content": "Hello Man",
        "status": "none",
        "date": "22/02/2012 11:12:11"
      }
    }]
    $scope.conversations["surgeharb"] = [{
      "date": "22/02/2012 11:12:11",
      "content": "Hello Man",
      "sender": "cedric",
      "receiver": "surgeharb"
    }]
  } else {
    $scope.chatConversations = [{
      "_id": "123456789abc",
      "name": "Cedric Harb",
      "username": "cedric",
      "profilePicture": cedric_pp,
      "lastmessage": {
        "content": "Hello Man",
        "status": "none",
        "date": "22/02/2012 11:12:11"
      }
    }]
    $scope.conversations["cedric"] = [{
      "date": "22/02/2012 11:12:11",
      "content": "Hello Man",
      "sender": "cedric",
      "receiver": "surgeharb"
    }]
  }

  $scope.conv = {};
  $scope.conv.user = {};

  $scope.sendMessage = function() {

    if ($scope.message) {
      var date = new Date();
      var message = {
        "date": format(date.getDate()) + "/" + format(date.getMonth() + 1) + "/" + format(date.getFullYear()) + " " + format(date.getHours()) + ":" + format(date.getMinutes()) + ":" + format(date.getSeconds()),
        "content": $scope.message,
        "sender": $scope.user.username,
        "receiver": $scope.conv.user.username
      }
      socket.emit("send", message);
      $scope.message = '', message = {};
      scrollBottom();
    }

  }

  $scope.checkEnter = function(event) {
    if (event.keyCode === 13) {
      $scope.sendMessage();
    }
  }

  $scope.getTime = function(date) {
    var time = date.split(" ")[1];
    var splitted = time.split(":");
    var hh = format(parseInt(splitted[0]));
    var mm = format(parseInt(splitted[1]));
    return hh + ":" + mm;
  }

  function format(number) {
    if (number < 10) {
      return "0" + number;
    } else {
      return number;
    }
  }

  function scrollBottom() {
    $('#conversation .body').stop().animate({ scrollTop: $('#conversation .body').prop("scrollHeight") }, 500);
  }

  $scope.fetchConversation = function(chat) {
    $scope.conv.user._id = chat._id;
    $scope.conv.user.name = chat.name;
    $scope.conv.user.username = chat.username;
    $scope.conv.user.profilePicture = chat.profilePicture;
  };



}]);