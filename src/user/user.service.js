var userModel = require('./user.model')

class userService {
  add(user) {
    const newUser = new userModel(user)
    return newUser.save();
  }
}

module.exports = new userService();