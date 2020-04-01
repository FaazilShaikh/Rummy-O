

// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
const {DeckOfTiles} =  require('./DeckOfTiles.js');

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});


//game
var functions ={};
var players = {};
var playercount =0;
var Deck = new DeckOfTiles();
Deck.Shuffle();

functions["new player"] = function(socket){
  console.log("Added Player")
  playercount++;
  players[socket.id] = {
    selection: "",
    name: playercount,
    hand:[]
  };


  players[socket.id].hand.push(Deck.DealTile());
  

}



io.on('connection', function(socket) {

  var onevent = socket.onevent;
  socket.onevent = function (packet) { //this is for the event handler below
      var args = packet.data || [];
      onevent.call (this, packet);    
      packet.data = ["Event"].concat(args);
      onevent.call(this, packet);      
  };


  
  socket.on("Event",function(event,...args){ //single event handler
    args =[...args] // 
  console.log(event + " " + args[0]);
  if(functions[event]){
  functions[event](socket,args);
  }
  });

  socket.on('disconnect', function(){
   delete players[socket.id];
    });
  });


    
   
