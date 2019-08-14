var mongoose = require('mongoose');
var User = require('../user/user.model')
var Breed = require('../breed/breed.model')

const DogSchema = new mongoose.Schema(
  {
    breed: {
      type: mongoose.Types.ObjectId, ref:Breed
    },
    name: String,
    gender: String,
    age: Number,
    owner: {
      type: mongoose.Types.ObjectId, ref: User
    }
  }
)

module.exports = mongoose.model('Dog', DogSchema)