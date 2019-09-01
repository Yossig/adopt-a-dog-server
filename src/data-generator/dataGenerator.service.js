const userModel = require('../user/user.model');
const userService = require('../user/user.service');
const dogModel = require('../dog/dog.model');
const breedModel = require('../breed/breed.model');
const statisticsModel = require('../statistics/statistics.model')
const statisticsService = require('../statistics/statistics.service')
const firstNames = require('./data-pool/names-first.json')
const surnames = require('./data-pool/names-surnames.json')
const maleDogNames = require('./data-pool/male-dog-names.json')
const femaleDogNames = require('./data-pool/female-dog-names.json')
const dogDescription = require('./data-pool/dog-description.json')
const dogProfilePictures = require('./data-pool/dog-pictures-urls.json')
const countries = require('./data-pool/countries.min.json')
const browsers = require('./data-pool/browsers.json')
const deviceTypes = require('./data-pool/device-types.json')
const operationSystems = require('./data-pool/os.json')
const addresses = require('./data-pool/addresses.json')

class dataGeneratorService {
  constructor() {
  }

  clearData() {
    const promises = [];
    promises.push(dogModel.deleteMany({}).exec())
    promises.push(userModel.deleteMany({}).exec())
    promises.push(statisticsModel.deleteOne({}).exec())
    return Promise.all(promises);
  }

  generateUsers(amount) {
    const promises = [];
    for (let index = 0; index < amount; index++) {
      var firstName = this.getRandomItemFromArray(firstNames.data);
      var surname = this.getRandomItemFromArray(surnames.data);
      var phoneNumber = this.getRandomItemFromArray(['050', '051', '052', '053', '054', '055', '058']) + (Math.floor(Math.random() * 9000000) + 1000000)
      var country = "Israel"
      var city = this.getRandomItemFromArray(Object.keys(addresses))
      var steert = this.getRandomItemFromArray(addresses[city])
      var number = Math.floor(Math.random() * 30)

      var newUser = {
        fullName: firstName + ' ' + surname,
        email: surname + '@gmail.com',
        phoneNumber: phoneNumber,
        address: {
          country: country,
          city: city,
          street: steert,
          number: number
        }
      }
      promises.push(userService.add(newUser));
    }

    return Promise.all(promises);
  }

  async generateDogs(amount) {
    const userIds = await userModel.find({}).select('_id').exec();
    const breedIds = await breedModel.find({ Breed: { $in: Object.keys(dogProfilePictures) } }).select(['_id', 'Breed']).exec();
    const promises = [];
    for (let index = 0; index < amount; index++) {
      var gender = this.getRandomItemFromArray(['male', 'female']);
      var name = gender === 'male' ? this.getRandomItemFromArray(maleDogNames) : this.getRandomItemFromArray(femaleDogNames);
      var age = Math.floor(Math.random() * 19);
      var isAdopted = this.getRandomItemFromArray(['false', 'true']);
      var description = this.getRandomItemFromArray(dogDescription);
      var breed = this.getRandomItemFromArray(breedIds);
      var profileImage = this.getRandomItemFromArray(dogProfilePictures[breed.Breed])
      var owner = this.getRandomItemFromArray(userIds);

      var newDog = new dogModel({
        name: name,
        gender: gender,
        age: age,
        isAdopted: isAdopted,
        description: description,
        owner: owner,
        breed: breed._id,
        profile_image: profileImage
      })

      promises.push(newDog.save())

    }

    return promises;
  }

  async generateEntries(amount) {
    statisticsService.initSketch();
    var statistics = new statisticsModel({
      hitCount: 0,
      lastClient: {},
      countMinSketch: {}
    })

    await statistics.save()
    const promises = []
    for (let index = 0; index < amount; index++) {
      var country = this.getRandomItemFromArray(Object.keys(countries))
      var city = this.getRandomItemFromArray(countries[country])
      var browser = this.getRandomItemFromArray(browsers)
      var os = this.getRandomItemFromArray(operationSystems)
      var type = this.getRandomItemFromArray(deviceTypes)

      var client = {
        Country: country,
        City: city,
        Browser: browser,
        OS: os,
        Type: type
      }

      for (var prop in client) {
        statisticsService.updateCMS(client[prop])
      }

      promises.push(statisticsModel.findOneAndUpdate({}, {
        lastClient: client,
        $inc: { hitCount: 1 },
        countMinSketch: statisticsService.sketch
      }))
    }

    return Promise.all(promises)
  }

  getRandomItemFromArray(data) {
    return data[Math.floor(Math.random() * data.length)];
  }
}

module.exports = new dataGeneratorService();