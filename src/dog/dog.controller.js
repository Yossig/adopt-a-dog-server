var dogService = require('./dog.service');

class dogCtrl {
  async getAll(req, res) {
    try {
      res.send(await dogService.getAll())
    }
    catch {
      res.sendStatus(500);
    }
  }
}

module.exports = new dogCtrl();
