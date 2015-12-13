var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String },
  firstName: String,
  lastName: String,
  walks: [{ type: mongoose.Schema.ObjectId, ref: 'Walk' }]


});

UserSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);