const scrapeService = require('./scarpe.service')
var breedModel = require('../breed/breed.model');
var mongoose = require('mongoose');

class scrapeCtrl {
  async scrapeAndInsertToDb() {
    try {
      console.log('Dropping breeds collection')
      await mongoose.connection.db.dropCollection('breeds')
      console.log('Scrpaing breeds data from wikipedia')
      const breedTable = await scrapeService.scrapeDogBreedsFromWikipedia()
      console.log('Saveign data to mongoDb')
      breedTable.forEach((row) => {
        new breedModel(row).save()
      })
      console.log('Done scraping proccess!')
    } catch (err) {
      console.log(err)
    }

  }
}

module.exports = new scrapeCtrl()