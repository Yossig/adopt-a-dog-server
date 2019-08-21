const cms = require('count-min-sketch'
)
class statisticsService {
  constructor() {
    this.lastClient = null;
    this.sketch = cms();
  }

  setClient(client) {

    for(var prop in client) {
      this.updateCMS(client[prop]);
    }

    this.lastClient = client;
  }

  updateCMS(key) {
    this.sketch.update(key, 1);
  }

  queryCMS(key) {
    return this.sketch.query(key);
  }

  getLastClient() {
    return this.lastClient;
  }

}

module.exports = new statisticsService()