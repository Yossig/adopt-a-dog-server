var mongoose = require('mongoose');
var User = require('../user/user.model')
const DogSchema = new mongoose.Schema(
  {
    breed: String,
    name: String,
    gender: String,
    age: Number,
    owner: {
      type: mongoose.Types.ObjectId, ref: User
    }
  }
)

module.exports = mongoose.model('Dog', DogSchema)