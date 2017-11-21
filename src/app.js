const WebServer = require('./web-server');


const OPTIONS = {
  port: process.env.PORT || 3002,
  authorize: false
};

const webServer = new WebServer(OPTIONS);
webServer.createServer();

webServer.listen()
  .then(() => {
    console.log(`Server listen on port: ${OPTIONS.port}`);
  })
  .catch((err) => {
    console.log("Can not start Server:", err);
  });
