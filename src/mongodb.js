const mongoose = require('mongoose');

function connect(connectionString) {
    return new Promise((resolve, reject) => {
  
      if (process.env.NODE_ENV === 'test') {
        const mockgoose = require('mockgoose').Mockgoose;
        const mockgooseObj = new mockgoose(mongoose);
  
        mockgoose.prepareStorage()
          .then(() => {
            mongoose.connect(connectionString,
              { useNewUrlParser: true, useCreateIndex: true })
              .then((res, err) => {
                if (err) return reject(err);
                resolve();
              })
          })
      } else {
          mongoose.connect(connectionString,
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
            .then((res, err) => {
              if (err) return reject(err);
              resolve();
            })
      }
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };  