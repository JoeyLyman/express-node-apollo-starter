// const mongoose = require("mongoose");
// NOTE: if mongoose disconnect doesnt work, might need to set mongoose to a variable in the setup
// see: https://stackoverflow.com/questions/8813838/properly-close-mongooses-connection-once-youre-done
async function stopServer(server) {
  server.httpServer.close(() => console.log("Test server closed."));

  server.mongoose.disconnect(() =>
    console.log(`Test mongoose connection closed.`)
  );
}

module.exports = async function() {
  // console.log(`global teardown exports called`);
  await stopServer(global.serverObject);
};
