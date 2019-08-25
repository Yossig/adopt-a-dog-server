const cms = require('count-min-sketch')
const statisticsModel = require('./statistics.model')

class statisticsService {
  constructor() {
    this.sketch = cms();
    this.clients = 0;

    (async () => {
      const { countMinSketch } = await statisticsModel.findOne({}).select('countMinSketch').exec();
      if (countMinSketch !== null) {
        this.sketch.fromJSON(countMinSketch);
      }
    })()
  }

  update(client) {
    for (var prop in client) {
      this.sketch.update(client[prop], 1);
    }

    this.clients++;
    return statisticsModel.findOneAndUpdate({}, {
      lastClient: client,
      $inc: { hitCount: 1 },
      countMinSketch: this.sketch.toJSON()
    }).exec()
  }

  clientDisconnected() {
    this.clients--;
  }

  queryCMS(key) {
    return this.sketch.query(key);
  }

  getLastClient() {
    return statisticsModel.findOne({}).select('lastClient').exec();
  }

  getHitCount() {
    return statisticsModel.findOne({}).select('hitCount').exec();
  }

}

module.exports = new statisticsService()