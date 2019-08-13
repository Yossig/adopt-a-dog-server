var breedModel = require('./breed.model')

class breedService{
  getAll() {
    return breedModel.find({}).exec()
  }
}

module.exports = new breedService()