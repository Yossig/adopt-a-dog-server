const userModel = require('../user/user.model');
const dogModel = require('../dog/dog.model');
const breedModel = require('../breed/breed.model');
const firstNames = require('./data-pool/names-first.json')
const surnames = require('./data-pool/names-surnames.json')
const maleDogNames = require('./data-pool/male-dog-names.json')
const femaleDogNames = require('./data-pool/female-dog-names.json')
const dogDescription = require('./data-pool/dog-description.json')
const requestPromise = require('request-promise')

class dataGeneratorService {
  constructor() {
  }

  clearData() {
    const promises = [];
    promises.push(dogModel.deleteMany({}).exec())
    promises.push(userModel.deleteMany({}).exec())

    return Promise.all(promises);
  }

  generateUsers(amount) {
    const promises = [];
    for (let index = 0; index < amount; index++) {
      var firstName = this.getRandomItemFromArray(firstNames.data);
      var surname = this.getRandomItemFromArray(surnames.data);
      var phoneNumber = this.getRandomItemFromArray(['050', '051', '052', '053', '054', '055', '058']) + (Math.floor(Math.random() * 9000000) + 1000000)
      var newUser = new userModel({
        fullName: firstName + ' ' + surname,
        email: surname + '@gmail.com',
        phoneNumber: phoneNumber
      })
      promises.push(newUser.save());
    }

    return Promise.all(promises);
  }

  async generateDogs(amount) {

    const userIds = await userModel.find({}).select('_id').exec();
    const breedIds = await breedModel.find({}).select(['_id', 'Breed']).exec();
    const promises = [];

    for (let index = 0; index < amount; index++) {
      var geneder = this.getRandomItemFromArray(['male', 'female']);
      var name = gender === 'male' ? this.getRandomItemFromArray(maleDogNames) : this.getRandomItemFromArray(femaleDogNames);
      var age = Math.floor(Math.random() * 19);
      var isAdopted = this.getRandomItemFromArray(['false', 'true']);
      var description = this.getRandomItemFromArray(dogDescription);
      var breed = this.getRandomItemFromArray(breedIds);
      var dogPhotoApi = await requestPromise(`https://dog.ceo/api/breed/${breed.Breed.toLowerCase().split(" ")[0]}/images`);
      var profileImage = this.getRandomItemFromArray(dogPhotoApi.message);
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

  async generate() {
    await this.generateOwners();
    await this.generateDogs();
  }

  getRandomItemFromArray(data) {
    return data[Math.floor(Math.random() * data.length)];
  }
}

module.exports = new dataGeneratorService();