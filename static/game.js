var socket = io();





  document.getElementById('buttons').addEventListener('click',function(event){
  if(event.target.id == "test"){
    socket.emit("clicked",event.target.id)
  }
  });

socket.emit('new player');



socket.on('msg', function(msg) {
document.getElementById("msg").innerHTML = msg;
});
