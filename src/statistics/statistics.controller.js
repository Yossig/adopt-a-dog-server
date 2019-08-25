const statisticsService = require('./statistics.service')
const requestPromise = require('request-promise')

class statisticsCtrl {
  getLastClient(req, res) {
    res.send(statisticsService.getLastClient());
  }

  getHitCount(req, res) {
    const hitCount = statisticsService.getHitCount();
    res.send({ hitCount });
  }

  queryCMS(key) {
    res.send(statisticsService.queryCMS(key));
  }

  async setClient(rawClient) {
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

    statisticsService.setClient(client);
  }
}

module.exports = new statisticsCtrl();