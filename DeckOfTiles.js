const {Tile} =  require('./Tile.js');

class DeckOfTiles{
  

  constructor(){
      this.Deck = [];
      var colors = ["Black","Red","Orange","Blue"]
      for(var v = 0;v<colors.length;v++){
        for(var i = 1;i<=13;i++){
          this.Deck.push(new Tile(i,colors[v]));
        }
      }
       this.Deck.push(new Tile("Joker","Red")); this.Deck.push(new Tile("Joker","Black"));

  }
  Shuffle(){
    var Deck = this.Deck
    for (var i = Deck.length - 1; i > 0; i--) {
     var j = Math.floor(Math.random() * (i + 1));
     var temp = Deck[i];
     Deck[i] = Deck[j];
     Deck[j] = temp;
  }
  }

  DealTile(){

    return this.Deck.pop();
  }
  DealHand(size){
    var arr = []
    if(size>this.Deck.length){
      size=this.Deck.length;
    }
    for(var i = 0;i<size;i++){
      arr[i] = this.DealTile();
    }
    return arr;
  }
};

module.exports.DeckOfTiles = DeckOfTiles;