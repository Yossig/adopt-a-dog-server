var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var scrapeCtrl = require('./scarping/scrape.controller')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());


mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(async () => {
    console.log('Mongo connection successful');
    if (process.env.SEED === 'true') {
      await scrapeCtrl.scrapeAndInsertToDb()
    }
  })
  .catch((err) => {
    console.log(err);
    console.log('Mongo connection error');
  });

app.use('/', indexRouter);


app.listen(process.env.EXPRESS_PORT, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`server is running on port ${process.env.EXPRESS_PORT}`);
})
module.exports = app;
