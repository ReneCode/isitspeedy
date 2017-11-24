const WebServer = require('./web-server');

const logService = require("./service/log-service");

const OPTIONS = {
  port: process.env.PORT || 3002,
  authorize: false
};


const webServer = new WebServer(OPTIONS);
webServer.createServer();


logService.init()
  .then(() => {
    return webServer.listen();
  })
  .then(() => {
    console.log(`Server listen on port: ${OPTIONS.port}`);
  })
  .catch((err) => {
    console.log("Can not start Server:", err);
  });

