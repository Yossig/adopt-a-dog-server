var userModel = require('./user.model')
const requestPromise = require('request-promise')

class userService {
  async add(user) {

    const uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${user.address.country},${user.address.city},${user.address.street},${user.address.number}&key=AIzaSyCgfUTGzlzr4DmsTbCy4OBkxqZ8y7nimxI`
    const { results } = await requestPromise({
      uri: uri,
      json: true
    })

    user.address.location = results[0].geometry.location
    const newUser = new userModel(user)
    return newUser.save();
  }

  async update(user) {
    const uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${user.address.country},${user.address.city},${user.address.street},${user.address.number}&key=AIzaSyCgfUTGzlzr4DmsTbCy4OBkxqZ8y7nimxI`
    const { results } = await requestPromise({
      uri: uri,
      json: true
    })

    user.address.location = results[0].geometry.location
    return userModel.findByIdAndUpdate(user._id, user, { new: true }).exec();
  }
}

module.exports = new userService();