const cms = require('count-min-sketch')
const statisticsModel = require('./statistics.model')
const requestPromise = require('request-promise')

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
      country: ipApi.country || 'unknown',
      city: ipApi.city || 'unknown',
      browser: rawClient.userAgent.browser.name,
      os: rawClient.userAgent.os.name,
      type: rawClient.userAgent.device.type || deviceType
    }

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

  getNumberOfConnectedClients() {
    return this.clients;
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