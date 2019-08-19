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
    profile_image: String,
    description: String,
    owner: {
      type: mongoose.Types.ObjectId, ref: User
    }
  }
)

DogSchema.post('findOneAndRemove', doc => {
  ws.broadcastDeletion(doc);
})

DogSchema.post('save', async doc => {
  ws.broadcastAddition(await doc.populate('owner').populate('breed').execPopulate());
})

module.exports = mongoose.model('Dog', DogSchema)