var dogService = require('./dog.service');
var userService = require('../user/user.service')
var mongoose = require('mongoose');

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

  async add(req, res) {
    try {
      const dog = req.body
      dog.owner = await userService.add(dog.owner)
      const newDog = await dogService.add(dog)
      res.send(await newDog.populate('owner').populate('breed').execPopulate())
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async update(req, res) {
    try {
      const dog = req.body;
      dog.owner = await userService.update(dog.owner)
      const updatedDog = await dogService.update(dog);
      res.send(await updatedDog.populate('owner').populate('breed').execPopulate())
    }
    catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  async adopted(req, res) {
    try {
      const dog = req.body;
      dog.isAdopted = true;
      res.send(await dogService.update(dog))
    }
    catch (err) {
      console.log(err)
      res.sendStatus(500);
    }
  }
}

module.exports = new dogCtrl();
