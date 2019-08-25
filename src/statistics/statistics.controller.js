const statisticsService = require('./statistics.service')
const requestPromise = require('request-promise')

class statisticsCtrl {
  async getLastClient(req, res) {
    try {
      res.send(await statisticsService.getLastClient())
    }
    catch (error) {
      console.error(err);
      res.sendStatus(500);
    }
  }

  async getHitCount(req, res) {
    try {
      res.send(await statisticsService.getHitCount())
    }
    catch (error) {
      console.error(err);
      res.sendStatus(500);
    }

  }

  queryCMS(key) {
    res.send(statisticsService.queryCMS(key));
  }

  async newClient(rawClient) {
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

    await statisticsService.newClient(client);
  }
}

module.exports = new statisticsCtrl();