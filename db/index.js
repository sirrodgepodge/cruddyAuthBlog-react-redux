const mongoose = require('mongoose'),
      Promise = require('bluebird');

module.exports = (URI) => {
    // begins connecting to mongo with connection string and gives us "connection" to listen to for events
    const db = mongoose.connect(URI).connection;

    // register mongoose models
    require('./models/post');
    require('./models/user');

    // return promise that will resolve once database is connected
    return new Promise(function(resolve, reject) {
      db.on('connected', () => !console.log("MongoDB connected!"));
      db.on('open', resolve); //happens after models are loaded
      db.on('error', reject);
    });
};
