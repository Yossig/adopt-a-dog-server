var dogService = require('./dog.service');

class dogCtrl {
  async getAll(req, res) {
    try {
      res.send(await dogService.getAll())
    }
    catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
  }

  async filter(req, res) {
    try {
      const filter = req.body
      res.send(await dogService.filter(filter))
    }
    catch (err) {
      console.log(err)
      res.sendStatus(500)
    }
  }

  async delete(req, res) {
    try {
      res.send(await dogService.delete(req.params.id))
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = new dogCtrl();
