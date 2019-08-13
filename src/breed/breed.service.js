var breedModel = require('./breed.model')

class breedService{
  getAll() {
    return breedModel.find({}).sort({Breed: 1}).exec()
  }
}

module.exports = new breedService()