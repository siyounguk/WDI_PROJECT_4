var mongoose = require("mongoose");

var placeSchema = new mongoose.Schema({
    place_id: String,
    name: String, 
    formatted_address: String,
    lat: Number,
    lon: Number
})

var WalkSchema = new mongoose.Schema({
  origin: [placeSchema],
  destination:[placeSchema], 
  stops: [placeSchema], 
  description: String,
  photo: String, 
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

// place_id, name, address, lat and lng 

module.exports = mongoose.model('Walk', WalkSchema);

