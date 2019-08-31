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

  delete(id) {
    return breedModel.findByIdAndRemove(id).exec();
  }

  add(breed) {
    const newBreed = new breedModel(breed);
    return newBreed.save();
  }

  update(breed) {
    return breedModel.findByIdAndUpdate(breed._id, breed, { new: true }).exec();
  }
  
}

module.exports = new breedService()