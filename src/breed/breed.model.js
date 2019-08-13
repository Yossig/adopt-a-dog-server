var mongoose = require('mongoose');

const BreedSchema = new mongoose.Schema({
  Breed: String,
  Origin: String,
  Image: String
})

module.exports = mongoose.model('Breed', BreedSchema)