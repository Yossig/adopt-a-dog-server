const statisticsService = require('./statistics.service')
const dogService = require('../dog/dog.service')

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

  async getStatisticsData(req, res) {
    try {
      const lastClient = await statisticsService.getLastClient();
      const numberOfConnectedClients = statisticsService.getNumberOfConnectedClients();
      const { hitCount } = await statisticsService.getHitCount();
      const groupBy = [
        {
          field: 'Gender',
          data: await dogService.groupBy('gender')
        },
        {
          field: 'Breed',
          data: await dogService.groupBy('breed')
        },
        {
          field: 'Age',
          data: await dogService.groupBy('age')
        },
        {
          field: 'Avarage age by gender',
          map: 'Gender',
          reduce: 'Age',
          data: (await dogService.mapReduceGenderAge()).results
        }
      ]

      res.send({ lastClient, numberOfConnectedClients, hitCount, groupBy });
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = new statisticsCtrl();