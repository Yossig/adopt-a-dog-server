const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  address: {
    country: String,
    city: String,
    street: String,
    number: Number,
    location: {
      lat: Number,
      lng: Number
    }
  }
})

module.exports = mongoose.model('User', UserSchema)