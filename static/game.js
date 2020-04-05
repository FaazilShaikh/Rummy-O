var socket = io();
var selected = [];
var selectedM =-1;
var clickedm = false;
var c = 0;
var counter =0;
  document.getElementById('buttons').addEventListener('click',function(event){
  if(event.target.id == "test"){
    var temp = [];
    for(let i of selected)
        i && temp.push(i); // copy each non-empty value to the 'temp' array
    selected = temp;
    socket.emit("play",selected)
  }
  else if(event.target.id =="replace"){
    var temp = [];
    for(let i of selected)
        i && temp.push(i); // copy each non-empty value to the 'temp' array
    selected = temp;
    var selectv = document.getElementById("replaceval")
    var val = selectv.options[selectv.selectedIndex].id
    var selectc = document.getElementById("replacecolor")
    var col = selectc.options[selectc.selectedIndex].id
    socket.emit("replace",selected,val,col)
  }
  else if(event.target.id=="end"){
    
    socket.emit("draw")
  }
  else if(event.target.id=="existing"){
    var temp = [];
    for(let i of selected)
        i && temp.push(i); // copy each non-empty value to the 'temp' array
    selected = temp;
    socket.emit("play existing",selectedM,selected)
  }
  });

socket.emit('new player',false);

socket.on("Success", function(){
selected = [];
});

socket.on("UpdateMeld", function(arr){
  counter =0;
  var r = document.getElementById("melds");
while( r.hasChildNodes() ){
  r.removeChild(r.lastChild);
}
for(var i =0;i<arr.length;i++){
 
    console.log(arr[i])
updatemeld(arr[i])
  
}

});

socket.on("Melds", function(arr){
  var holder =document.createElement("div")
  holder.className = "meld"
  holder.id = counter;
  counter++
  document.getElementById("melds").appendChild(holder)
  for(var i =0;i<arr.length;i++){
  var card = document.createElement("div")
  var text = document.createElement("div")
  text.innerHTML = arr[i].value
  text.style.color = arr[i].color
  card.className = "card"
  card.id = i
 holder.appendChild(card)
  card.appendChild(text)

  card.addEventListener('click',function(event){
    if(event.target.parentNode.className == "meld" && (selectedM==-1)){
      var nodes = document.getElementById("melds").childNodes;
      for(var i =0;i<nodes.length;i++ )
      {
        console.log(nodes[i])
        if(nodes[i].tagName==("DIV")){
       nodes[i].style.color = "black"
        }
      }
    event.target.parentNode.style.color = "blue"
    selectedM=event.target.parentNode.id
    clickedm =true
    console.log(selectedM)

  }
  else if(event.target.parentNode.className == "meld" &&(selectedM==event.target.parentNode.id)){

    

    selectedM =  -1
    clickedm=false
    event.target.parentNode.style.color ="black" 
    console.log("Turning off")
  }
  else if(event.target.parentNode.className == "meld" &&(selectedM!=-1)){
    var nodes = document.getElementById("melds").childNodes;
    for(var i =0;i<nodes.length;i++ )
    {
      console.log(nodes[i])
      if(nodes[i].tagName==("DIV")){
     nodes[i].style.color = "black"
      }
    }
    selectedM = event.target.parentNode.id
    clickedm=true
    event.target.parentNode.style.color ="blue" 
    console.log("T")
  }
  
 
    
    });

  }
  c=c+3;
  var br = document.createElement("br")
  document.getElementById("melds").insertBefore(br, document.getElementById("melds").childNodes[c])

 

});


socket.on('Hand', function(arr) {
  

 // document.getElementById("cards").removeChild(document.getElementById("cards").childNodes[i])
var r = document.getElementById("cards");
while( r.hasChildNodes() ){
  r.removeChild(r.lastChild);
}

for(var i =0;i<arr.length;i++){
  var card = document.createElement("div")
  var text = document.createElement("div")
  text.innerHTML = arr[i].value
  text.style.color = arr[i].color
  card.className = "card"
  card.id = i
  document.getElementById("cards").appendChild(card)
  card.appendChild(text)

  card.addEventListener('click',function(event){
    if(event.target.className == "card" && (selected.indexOf(event.target.id)==-1)){
    event.target.style.color = "blue"
    selected.push(event.target.id)
  }
  else if(event.target.className == "card"){
    selected[selected.indexOf(event.target.id)] = null;
    event.target.style.color ="black" 
  }
    
    });
  }
  
  });
  


socket.on('player', function(msg) {
document.getElementById("msg").innerHTML = msg;
});
socket.on('msg', function(msg) {
  document.getElementById("msg2").innerHTML = msg;
  });



function updatemeld(arr){
  selectedM = -1;
  var holder =document.createElement("div")
  holder.className = "meld"
  holder.id = counter;
  counter++
  document.getElementById("melds").appendChild(holder)
  for(var i =0;i<arr.length;i++){
  var card = document.createElement("div")
  var text = document.createElement("div")
  text.innerHTML = arr[i].value
  text.style.color = arr[i].color
  card.className = "card"
  card.id = i
 holder.appendChild(card)
  card.appendChild(text)

  card.addEventListener('click',function(event){
    if(event.target.parentNode.className == "meld" && (selectedM==-1)){
      var nodes = document.getElementById("melds").childNodes;
      for(var i =0;i<nodes.length;i++ )
      {
        console.log(nodes[i])
        if(nodes[i].tagName==("DIV")){
       nodes[i].style.color = "black"
        }
      }
    event.target.parentNode.style.color = "blue"
    selectedM=event.target.parentNode.id
    clickedm =true
    console.log(selectedM)

  }
  else if(event.target.parentNode.className == "meld" &&(selectedM==event.target.parentNode.id)){

    

    selectedM =  -1
    clickedm=false
    event.target.parentNode.style.color ="black" 
    console.log("Turning off")
  }
  else if(event.target.parentNode.className == "meld" &&(selectedM!=-1)){
    var nodes = document.getElementById("melds").childNodes;
    for(var i =0;i<nodes.length;i++ )
    {
      console.log(nodes[i])
      if(nodes[i].tagName==("DIV")){
     nodes[i].style.color = "black"
      }
    }
    selectedM = event.target.parentNode.id
    clickedm=true
    event.target.parentNode.style.color ="blue" 
    console.log("T")
  }
  
 
    
    });

  }
  c=c+3;
  var br = document.createElement("br")
  document.getElementById("melds").insertBefore(br, document.getElementById("melds").childNodes[c])

 

}