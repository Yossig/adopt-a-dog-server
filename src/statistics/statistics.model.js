const mongoose = require('mongoose');

const StatisticsSchema = new mongoose.Schema({
  userCount: Number,
  lastClient: Object,
  countMinSketch: Object
})

module.exports = mongoose.model('statistic', StatisticsSchema)