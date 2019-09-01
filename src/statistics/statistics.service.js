const cms = require('count-min-sketch')
const statisticsModel = require('./statistics.model')
const requestPromise = require('request-promise')

class statisticsService {
  constructor() {
    this.initSketch();

    this.clients = 0;

    (async () => {
      const { countMinSketch } = await statisticsModel.findOne({}).select('countMinSketch').exec();
      if (countMinSketch !== null) {
        this.sketch.fromJSON(countMinSketch);
      }
    })()
  }

  initSketch() {
    this.sketch = cms();
  }
  async update(rawClient) {
    if (rawClient.ip === '::1') {
      const currentIpApi = await requestPromise({
        uri: 'https://api.ipify.org/?format=json',
        json: true
      })

      rawClient.ip = currentIpApi.ip;
    }

    const ipApi = await requestPromise({
      uri: `http://ip-api.com/json/${rawClient.ip}`,
      json: true
    })

    let deviceType;
    switch (rawClient.userAgent.os.name) {
      case 'Windows': {
        deviceType = 'PC'
      }
        break;
      case 'Android': {
        deviceType = 'mobile'
      }
        break;
      default: {
        deviceType = undefined
      }
    }

    let client = {
      Country: ipApi.country || 'unknown',
      City: ipApi.city || 'unknown',
      Browser: rawClient.userAgent.browser.name,
      OS: rawClient.userAgent.os.name,
      Type: rawClient.userAgent.device.type || deviceType
    }

    for (var prop in client) {
      this.updateCMS(client[prop])
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

  getNumberOfConnectedClients() {
    return this.clients;
  }

  queryCMS(key) {
    return this.sketch.query(key);
  }

  updateCMS(key) {
    this.sketch.update(key, 1);
  }

  async getLastClient() {

    const { lastClient } = await statisticsModel.findOne({}).select('lastClient').exec();
    var clientWithQuery = []

    for (var prop in lastClient) {
      clientWithQuery.push({
        field: prop,
        value: lastClient[prop],
        frequency: this.queryCMS(lastClient[prop])
      })
    }

    return clientWithQuery;
  }

  getHitCount() {
    return statisticsModel.findOne({}).select('hitCount').exec();
  }

}

module.exports = new statisticsService()