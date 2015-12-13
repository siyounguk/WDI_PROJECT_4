var mongoose = require("mongoose");

var WalkSchema = new mongoose.Schema({
  origin: String,
  destination: String, 
  stops: Array, 
  description: String,
  photo: String
});

module.exports = mongoose.model('Walk', WalkSchema);