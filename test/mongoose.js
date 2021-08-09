const mongoose = require("mongoose");

async function connect() {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };
  return await mongoose.connect(process.env.MONGODB, mongooseOptions);
}

async function disconnect() {
  mongoose.disconnect();
}

module.exports = { connect, disconnect };
