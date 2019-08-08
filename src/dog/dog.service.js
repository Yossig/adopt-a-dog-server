var dogModel = require('./dog.model');

class dogService {
  getAll() {
    return dogModel.find({}).exec();
  }
}

module.exports = new dogService();