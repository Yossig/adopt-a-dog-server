var breedService = require('./breed.service')

class breedCtrl {
  async getAll(req, res) {
    try {
      res.send(await breedService.getAll())
    }
    catch (err) {
      console.log(err)
      res.sendStatus(500)
    }

  }
}

module.exports = new breedCtrl()