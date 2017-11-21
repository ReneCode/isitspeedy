var WebServer = require('../src/web-server');

const OPTIONS = {
  port: 3102,
  authorize: false,
  logging: false
};

let API = undefined;

/*
  start & stop the backend server for the mocha tests

  before() and after() are used before and after *ALL* test.spec.files
*/

before('start server', () => {
  // create Server
  let webServer = new WebServer(OPTIONS);
  webServer.createServer()
  webServer.listen()
    .then(api => {
      // server started
      API = api;
    });
});

after('close server', (done) => {
  // console.log("stop testing backend server")
  API.close(() => {
    done();
  });
});
