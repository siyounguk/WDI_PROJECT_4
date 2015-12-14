var mongoose = require("mongoose");
var placeSchema = new mongoose.Schema({
    place_id: String,
    name: String, 
    formatted_address: String,
    lat: Number,
    lng: Number
})

var WalkSchema = new mongoose.Schema({
  origin: placeSchema,
  destination: placeSchema, 
  stops: [placeSchema], 
  description: String,
  photo: String, 
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});



module.exports = mongoose.model('Walk', WalkSchema);

