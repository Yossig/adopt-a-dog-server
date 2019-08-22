const cms = require('count-min-sketch')
const statisticsModel = require('./statistics.model')

class statisticsService {
  constructor() {
    this.sketch = cms();
    this.loadStatisticsData();
  }

  async setClient(client) {

    for (var prop in client) {
      this.sketch.update(client[prop], 1);
    }

    this.lastClient = client;
    this.userCount++;

    await statisticsModel.findOneAndUpdate({}, {
      lastClient: this.lastClient,
      userCount: this.userCount,
      countMinSketch: this.sketch.toJSON()
    }).exec()
  }

  async loadStatisticsData() {
    const statistics = await statisticsModel.findOne({}).exec();
    this.lastClient = statistics.lastClient;
    this.userCount = statistics.userCount;
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

}

module.exports = new statisticsService()