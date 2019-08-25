const cms = require('count-min-sketch')
const statisticsModel = require('./statistics.model')

class statisticsService {
  constructor() {
    this.sketch = cms();
    this.loadStatisticsData(); //instead its  gonna be "loadSketch"
  }

  async setClient(client) {

    for (var prop in client) {
      this.sketch.update(client[prop], 1);
    }

    this.lastClient = client;
    this.hitCount++;

    // this will be 2 different updates, one for hit count (use $inc) and last user connected collection
    // one for sketch collection
    await statisticsModel.findOneAndUpdate({}, {
      lastClient: this.lastClient,
      hitCount: this.hitCount,
      countMinSketch: this.sketch.toJSON()
    }).exec()
  }

  async loadStatisticsData() {
    const statistics = await statisticsModel.findOne({}).exec();
    this.lastClient = statistics.lastClient;
    this.hitCount = statistics.hitCount;
    if (statistics.countMinSketch !== null) {
      this.sketch.fromJSON(statistics.countMinSketch);
    }
  }

  queryCMS(key) {
    return this.sketch.query(key);
  }

  getLastClient() {
    return this.lastClient;
  }

  getHitCount() {
    return this.hitCount || 0
  }

}

module.exports = new statisticsService()