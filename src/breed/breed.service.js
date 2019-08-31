var breedModel = require('./breed.model')
var AhoCorasick = require('ahocorasick');

class breedService {
  constructor() {
    (async () => {
      const res = await breedModel.find({}).exec();
      this.originsAho = new AhoCorasick(res.map(it => it.Origin))
      this.breedAho = new AhoCorasick(res.map(it => it.Breed))
    })()
  }

  getAll() {
    return breedModel.find({}).sort({ Breed: 1 }).exec()
  }

  filter(filter) {
    const { origins } = filter;
    const aggregateQuery = [];
    let matchQuery = {};
    if (origins.length > 0) {
      matchQuery.Origin = { $in: origins }
    }

    if (filter.search) {
      let originResult = this.originsAho.search(filter.search);
      let breedResult = this.breedAho.search(filter.search);
      matchQuery.$or = [{ Breed: { $in: breedResult.map(it => it[1][0]) } }, { Origin: { $in: originResult.map(it => it[1][0]) } }]
    }

    aggregateQuery.push({ $match: matchQuery })
    return breedModel.aggregate(aggregateQuery).exec();
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