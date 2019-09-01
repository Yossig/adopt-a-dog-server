var dogModel = require('./dog.model');
var mongoose = require('mongoose');

class dogService {
  getAll() {
    return dogModel.find({ isAdopted: false }).populate('owner').populate('breed').exec();
  }

  filter(filter) {
    const aggregateQuery = [];
    const matchQuery = {};

    matchQuery.isAdopted = false;

    if (filter.genders && filter.genders.length > 0) {
      matchQuery.gender = { $in: filter.genders }
    }

    if (filter.breeds && filter.breeds.length > 0) {
      matchQuery.breed = { $in: filter.breeds.map(it => new mongoose.Types.ObjectId(it)) }
    }

    matchQuery.age = { $gte: filter.minAge }

    aggregateQuery.push({ $match: matchQuery })
    aggregateQuery.push({
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner'
      }
    })
    aggregateQuery.push({
      $lookup: {
        from: 'breeds',
        localField: 'breed',
        foreignField: '_id',
        as: 'breed'
      }
    })

    return dogModel.aggregate(aggregateQuery).exec()
  }

  delete(id) {
    return dogModel.findByIdAndRemove(id).populate('owner').populate('breed').exec();
  }

  add(dog) {
    const newDog = new dogModel(dog);
    return newDog.save();
  }

  update(dog) {
    return dogModel.findByIdAndUpdate(dog._id, dog, { new: true }).exec();
  }

  groupBy(field) {
    const aggregateQuery = [];
    aggregateQuery.push({
      $match: {
        isAdopted: true
      }
    })

    aggregateQuery.push(
      {
        $group: {
          _id: '$' + field,
          count: { $sum: 1 }
        }
      })

    aggregateQuery.push({
      $sort: {
        _id: 1
      }
    })

    if (field === "breed") {
      aggregateQuery.push({
        $lookup: {
          from: 'breeds',
          localField: '_id',
          foreignField: '_id',
          as: 'breed'
        }
      })
    }
    return dogModel.aggregate(aggregateQuery).exec();

  }

  mapReduceGenderAge() {
    var o = {};
    o.map = function () {
      emit(this.gender, this.age)
    }

    o.reduce = function (k, values) {
      return values.reduce((a,b) => a+b) / values.length;
    }

    o.query = {
      isAdopted: true
    }

    return dogModel.mapReduce(o)
  }
}

module.exports = new dogService();