

// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
const {DeckOfTiles} =  require('./DeckOfTiles.js');
const {Tile} = require('./Tile.js');
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
var melds = [];
var turn={};
turn.Players = [];
turn.Index = 0;

var Deck = new DeckOfTiles();
Deck.Shuffle();

io.on('connection', function(socket) {

  var onevent = socket.onevent;
  socket.onevent = function (packet) { //this is for the event handler below
      var args = packet.data || [];
      onevent.call (this, packet);    
      packet.data = ["Event"].concat(args);
      onevent.call(this, packet);      
  };


  
  socket.on("Event",function(event,...args){ //single event handler
    args =[...args] 
   
    var arg = []

   // if(socket.id ==turn.Players(turn.Index)) this would have been the check to see if its a players turn
  if(functions[event] && (players[socket.id] || event =="new player"))
  functions[event](socket,args);
  
  });

  socket.on('disconnect', function(){
   delete players[socket.id];
    });
  });


    
   

  functions["new player"] = function(socket){
    
    playercount++;
    if(playercount<=4 && !players[socket.id]){
    players[socket.id] = {
      selection: "",
      name: playercount,
      hand:Deck.DealHand(14)
    };
    
  
  turn.Players.push(socket.id);
  socket.emit('Hand',players[socket.id].hand);
  for(var i=0;i<melds.length;i++)
  {socket.emit('Melds',melds[i])}

  socket.emit('player',"You are player " +players[socket.id].name )
}
else{
  for(var i=0;i<melds.length;i++)
  {socket.emit('Melds',melds[i])}
  socket.emit('player',"Players full, you are a spectator")
}
  }
  
  
  functions["draw"] = function(socket){
    
    if (Deck.Deck.length !=0){
      
    
  players[socket.id].hand.push(Deck.DealTile());
  socket.emit('Hand',players[socket.id].hand);
  functions["end turn"](); //this is to end the turn, it works but it wont do anything as the check above is commented for easier testing
  socket.emit('msg',"Tile drawn")
  socket.emit("Success")
    }
    else{
      socket.emit('msg',"Deck Empty")
      socket.emit('Hand',players[socket.id].hand);
      socket.emit("Success")
    }

  }

  functions["end turn"] = function(){
    if(turn.Index>=4){turn.Index =0}
    else{turn.Index++}
   
  }
  
  functions["replace"] = function(socket,args){
 

    var temp = players[socket.id].hand[args[0][0]]
    if(temp){
    if (temp.value == "Joker") {
    temp.setValue(args[1])
    temp.setColor(args[2])
    socket.emit('Hand',players[socket.id].hand);
    socket.emit("Success")
    socket.emit('msg',"Successfully changed joker")
    }
    else{
      socket.emit('msg',"Error could not change joker(tile is not a joker, possibly selected more than 1 tile") 
    }
  }
  else{
   
      socket.emit('msg',"Error could not change joker") 
    
  }
  

  }


  functions["play existing"] = function(socket,args){
    console.log(args)
    if(melds[args[0]] && args[1].length == 1 && players[socket.id].hand[args[1][0]]){
      var temp =[]
      var temp2 =[]
      for(var i=0;i<melds[args[0]].length;i++){
        
        temp.push(melds[args[0]][i])
        temp2.push(melds[args[0]][i])
        
      }
      console.log(temp)
console.log(temp2)
console.log("Pushing..")
      temp.push(players[socket.id].hand[args[1][0]])
      temp2.unshift(players[socket.id].hand[args[1][0]])
      console.log(temp)
      console.log(temp2)
      console.log("temp2---")
      if(functions["test run"](socket,temp) ||  functions["test meld"](socket,temp)){
      
        melds[args[0]] =null
        melds.push(temp)
        
        players[socket.id].hand[args[1][0]] = null
        var t = [];
        for(let i of melds)
          i && t.push(i);
        melds = t;
        console.log("Melds before update")
        console.log(melds)
        socket.emit("UpdateMeld",melds)
        var t = [];
        for(let i of players[socket.id].hand)
          i && t.push(i);
        players[socket.id].hand = t
        socket.emit('Hand',players[socket.id].hand);
        socket.emit('Success')
      
      }
      else if(functions["test meld"](socket,temp2)){
        
        melds[args[0]] =null
        melds.push(temp2)
        
        players[socket.id].hand[args[1][0]] = null
        var t = [];
        for(let i of melds)
          i && t.push(i);
        melds = t;
        socket.emit("UpdateMeld",melds)
        t = [];
        for(let i of players[socket.id].hand)
          i && t.push(i);
        players[socket.id].hand = t
        socket.emit('Hand',players[socket.id].hand);
        socket.emit('Success')
      }

    }
    else{
      socket.emit('msg',"Make sure you have selected a meld, or only 1 tile") 
    }
  }

  functions["test run"] = function(socket,arr1){
    for(var i= 0;i<arr1.length;i++){ //check for three tiles of the same value, diff colors
      if(!((i+1)>arr1.length-1)){
        for(var j =i+1;j<arr1.length;j++){
         if((parseInt(arr1[i].value) ==parseInt(arr1[j].value)) && (arr1[i].color !=arr1[j].color)){
          D = true
         }
         else{
          i=arr1.length
          D=false;
          break;
         }
        }
      }
    }
    if(!D){//invalid
    console.log("invalid!")
    return false
    }
    else{
      console.log("Valid!")
      return true
      
    }
    
  }

  functions["test meld"] = function(socket,arr1){
    for(var i= 0;i<arr1.length;i++){
      if(!((i+1)>arr1.length-1)){
        if((parseInt(arr1[i].value)+1 ==parseInt(arr1[i+1].value)) && (arr1[i].color ==arr1[i+1].color)){
      
        D =true
        }
        else{
          i=arr1.length
          D= false;
          break;
        }
      }
    } 
    if(!D){//invalid
      console.log("invalid!")
      return false
      }
      else{
        console.log("Valid!")
        return true
      }
    
  }


  functions["play"] = function(socket,args){
    var D= false;
    var temp = [];
    var t = [];
  
  if (args[0] !=null && args[0].length ==3){

 

    for(let i of args[0])
       { i && temp.push(players[socket.id].hand[i])
        t.push(i);
       }
    args[0] = temp;
   
  for(var i= 0;i<args[0].length;i++){ //check for three tiles of the same value, diff colors
    if(!((i+1)>args[0].length-1)){
      for(var j =i+1;j<args[0].length;j++){
       if((parseInt(args[0][i].value) ==parseInt(args[0][j].value)) && (args[0][i].color !=args[0][j].color)){
        D = true
       }
       else{
        i=args[0].length
        D=false;
        break;
       }
      }
    }
  }
  
  if(!D){ //check for meld of consecutive tiles,same color
    for(var i= 0;i<args[0].length;i++){
      if(!((i+1)>args[0].length-1)){
        if((parseInt(args[0][i].value)+1 ==parseInt(args[0][i+1].value)) && (args[0][i].color ==args[0][i+1].color)){
      
        D =true
        }
        else{
          i=args[0].length
          D= false;
          break;
        }
      }
    } 
  }
  
  
  if(!D){
    console.log("Invalid play")
    socket.emit('msg',"Invalid play, possibly selected tiles not consecutively") 
  }
  else{console.log("Valid!")
  socket.emit('msg',"Valid play") 
  melds.push(temp)
  io.sockets.emit("Melds",temp)

  functions["checkWinner"](socket)
functions["end turn"]()

 for(var i =0;i<t.length;i++){
   players[socket.id].hand[t[i]] = null;
 }

 var temp = [];
 for(let i of players[socket.id].hand)
     i && temp.push(i);
     players[socket.id].hand = temp

     socket.emit('Hand',players[socket.id].hand);
     socket.emit('Success');

  }

}
  };
  
  functions["checkWinner"] = function(socket){
  if(players[socket.id].hand.length ==0){
console.log("Winner is " + players[socket.id].name)
io.sockets.emit('msg',"Winner is " + players[socket.id].name) 
  }
  }

/*  for the tests

functions["check Winner"] = function(Player){ 
    if(Player.hand.length ==0){
return false
    }
    }

  
  functions["AppendTile"] = function (input,input1){
    input.push(input1);
    return input
}
  
//module.exports.Functions = functions;*/