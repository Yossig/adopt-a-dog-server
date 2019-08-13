var dogModel = require('./dog.model');

class dogService {
  getAll() {
    return dogModel.find({}).exec();
  }

  filter(filter) {
    const aggregateQuery = [];
    const matchQuery = {};

    if(filter.genders && filter.genders.length > 0) {
      matchQuery.gender = {$in: filter.genders}
    }

    if(filter.breeds && filter.breeds.length > 0) {
      matchQuery.breed = {$in: filter.breeds}
    }

    matchQuery.age = {$gte:filter.minAge}

    aggregateQuery.push({$match: matchQuery})

    return dogModel.aggregate(aggregateQuery).exec()
  }
}

module.exports = new dogService();