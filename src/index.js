require("module-alias/register");
const mongoose = require("mongoose");
const WORKERS = process.env.WEB_CONCURRENCY;
const cluster = require("cluster");
// const numCPUs = require('os').cpus().length;

const events = require("@util/events/");

// const { ObjectId } = mongoose.Types;

function setupEnv() {
  if (process.env.DEBUG == "false") {
    // if (!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for (var i = 0; i < methods.length; i++) {
      console[methods[i]] = function () {};
    }
  }
}

// ObjectId.prototype.valueOf = function () {
//   return this.toString();
// };

const startServer = async function () {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  console.log(`port:`, process.env.PORT);
  console.log(`mongodb:`, process.env.MONGODB);

  const app = require("./app");

  try {
    const promised = await Promise.all([
      mongoose.connect(process.env.MONGODB, mongooseOptions),
      app.listen(process.env.PORT),
    ]);
    // eslint-disable-next-line no-console

    console.log(
      `Server has started on port: ${process.env.PORT}, connected to mongo at ${process.env.MONGODB}`
    );

    // Emit Event
    events.emit("mongooseConnectionStarted", global.mainWorker);

    return {
      mongoose: promised[0],
      httpServer: promised[1],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Could not start the app: `, error);
  }
};

///////////////
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  // have a mainWorker
  var mainWorkerId = null;

  cluster.on("online", (worker, address) => {
    if (mainWorkerId === null) {
      console.log("Making worker " + worker.id + " to main worker");
      mainWorkerId = worker.id;
      worker.send({ order: "startAsMainWorker" });
    } else {
      worker.send({ order: "start" });
    }
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Receive messages from the master process.
  process.on("message", function (msg) {
    console.log(
      "Worker " + process.pid + " received message from master.",
      msg
    );
    if (msg.order == "startAsMainWorker") {
      global.mainWorker = true;
      setupEnv();
      startServer();
    }
    if (msg.order == "start") {
      setupEnv();
      startServer();
    }
  });

  console.log(`Worker ${process.pid} started`);
}

module.exports = { startServer };
