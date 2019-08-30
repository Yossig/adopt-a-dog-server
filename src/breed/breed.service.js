var breedModel = require('./breed.model')

class breedService {
  getAll() {
    return breedModel.find({}).sort({ Breed: 1 }).exec()
  }

  filter(filter) {
    const { origins } = filter;
    let query = {};
    if (origins.length > 0) {
      query.Origin = {
        $in: origins
      }
    }

    return breedModel.find(query).exec();
  }
}

module.exports = new breedService()