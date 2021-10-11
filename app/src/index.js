'use strict';

const path = require('path');
const config = require('./tools/config_tool')(path.join(__dirname, 'config/env'));
const app = require('./tools/express_tool').createApp();
const router = require('./routes/index');
const db = require('./models');


// init parent path and router
app.use('/', router);

// Connection to Database mongoose (MongoDb)
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// open server with port & source from file config 
app.listen(config.get("server:port"), () => {
  console.log(`listening on port : ${config.get("server:port")} - ${config.get("source")}`);
});

module.exports = app;