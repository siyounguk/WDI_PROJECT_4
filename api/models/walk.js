var mongoose = require("mongoose");

var WalkSchema = new mongoose.Schema({
  origin: String,
  destination: String, 
  stops: Array, 
  description: String,
  photo: String, 
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

// place_id, name, address, lat and lng 

module.exports = mongoose.model('Walk', WalkSchema);


// {
//     place_id: String,
//     name: String, 
//     formatted_address: String,
//     lat: Number,
//     lon: Number
//   }