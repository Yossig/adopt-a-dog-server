var mongoose = require('mongoose');

const DogSchema = new mongoose.Schema(
  {
    type: String,
    name: String,
    gender: String,
    age: Number
  }
)

module.exports = mongoose.model('Dog', DogSchema)