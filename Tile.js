class Tile{
    constructor(value,color){
        this.value = value;
        this.color = color;
    }
  setValue(val){
      this.value = parseInt(val);

  }

  setColor(col){
      this.color = col;
  }
  
  };

  
  
  module.exports.Tile = Tile;