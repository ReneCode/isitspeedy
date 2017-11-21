const WebServer = require('./web-server');


const OPTIONS = {
  port: process.env.PORT || 3002,
  authorize: false
};

const webServer = new WebServer(OPTIONS);
webServer.createServer();

webServer.listen()
  .then(() => {
    console.log("server listen on port:", OPTIONS.port);
  })
  .catch((err) => {
    console.log("can not start to blobstorage:", err);
  });
