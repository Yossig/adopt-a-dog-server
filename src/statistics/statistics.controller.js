const statisticsService = require('./statistics.service')

class statisticsCtrl {
  getLastClient() {
    statisticsService.getLastClient();
  }

  update(key) {
    statisticsService.updateCMS(key);
  }

  query(key) {
    statisticsService.queryCMS(key);
  }

  setClient(rawClient) {
    //todo: call ip to geolocation api
    let deviceType;
    switch(rawClient.userAgent.os.name) {
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
      country: '',
      city: '',
      browser: rawClient.userAgent.browser.name,
      os: rawClient.userAgent.os.name,
      type: rawClient.userAgent.device.type || deviceType
    }

    statisticsService.setClient(client);
  }
}

module.exports = new statisticsCtrl();