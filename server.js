var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

var scores = {
  blue: 0,
  red: 0
};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  // create a new player and add it to our players object
  players[socket.id] = {
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'Joueur 1' : 'Joueur 2'
  };
 
  socket.emit('currentPlayers', players);
  socket.emit('scoreUpdate', scores);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });

});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
