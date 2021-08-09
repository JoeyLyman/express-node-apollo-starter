require("module-alias/register");
require("dotenv").config({ path: "env/test.env" });
require("@babel/register");
const mongoose = require("mongoose");

// const serverClient = require("../src/index");

const app = require("../src/app");

async function startServer() {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };

  try {
    const promised = await Promise.all([
      mongoose.connect(process.env.MONGODB, mongooseOptions),
      app.listen(process.env.PORT)
    ]);
    // eslint-disable-next-line no-console
    console.log(
      `Server has started on port: ${process.env.PORT}, connected to mongo at ${process.env.MONGODB}`
    );
    return {
      mongoose: promised[0],
      httpServer: promised[1]
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Could not start the app: `, error);
  }
}

module.exports = async function() {
  global.serverObject = await startServer();
  // global.server = startServer;
  // //await startServer();
  // global.serverObject = await global.server();
};

// module.exports = async function() {
//   console.log(`global setup exports called`);
//   global.server = require("../src/index");
//   await global.server.startServer();
// };

// module.exports = async () => {
//   global.app = serverClient.startServer;
//   await serverClient.startClusteredServer(global.app);
// };
