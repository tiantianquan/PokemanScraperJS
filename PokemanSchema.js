var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/Pokeman');

var PokemanSchema = new Schema({
  No: String,
  Name: String,
  EName: String,
  Category: String,
  Property: Array,
  Introduce: {
    Outlook: String,
    Ability: String,
    SexDifferent: String,
    Disposition: String,
    Habitat: String,
    Food: String
  },
  OtherIntroduce: String,
  ImgUrl:{
    MainImg:String,
    ForwardImg:String,
    BackImg:String
  },

  WikiLink:String
});

module.exports = mongoose.model('PokemanMain',PokemanSchema);