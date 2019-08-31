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

  async filter(req, res) {
    const filter = req.body;

    try {
      res.send(await breedService.filter(filter))
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async update(req, res) {
    try {
      const breed = req.body;
      res.send(await breedService.update(breed))
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async delete(req, res) {
    try {
      res.send(await breedService.delete(req.params.id))
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async add(req, res) {
    try {
      const breed = req.body
      res.send(await breedService.add(breed))
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = new breedCtrl()