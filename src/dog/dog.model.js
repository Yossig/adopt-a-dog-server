var mongoose = require('mongoose');
var User = require('../user/user.model')
var Breed = require('../breed/breed.model')
var ws = require('../ws');
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

DogSchema.post('findOneAndRemove', doc => {
  ws.broadcastDeletion(doc);
})

module.exports = mongoose.model('Dog', DogSchema)