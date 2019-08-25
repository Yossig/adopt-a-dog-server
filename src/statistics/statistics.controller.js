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

  queryCMS(req, res) {
    try {
      const key = req.body;
      res.send(statisticsService.queryCMS(key));
    }
    catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }

  getNumberOfConnectedClients(req, res) {
    try {
      const numberOfConnectedClients = statisticsService.getNumberOfConnectedClients();
      res.send({ numberOfConnectedClients })
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = new statisticsCtrl();