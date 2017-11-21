
const axios = require('axios');
const Promise = require('bluebird');

const StopWatch = require('./stop-watch')

class ExecuteRequest {

  execute(requests) {

    const results = [];

    const executeRequest = (request) => {
      // console.log("executeRequest:", request)
      const watch = new StopWatch();
      watch.start();
      return axios.get(request)
        .then(r => {
          const dur = watch.stop();
          results.push({
            ok: true,
            url: request,
            status: r.status,
            duration: dur
          })
        })
        .catch(e => {
          let status = ''
          if (e.response) {
            status = e.response.status
          }
          const dur = watch.stop();
          results.push({
            error: "" + e,
            url: request,
            status: status,
            duration: dur
          })
        })
    }

    return Promise.each(requests, (request) => {
      return executeRequest(request)
    })
      .then(r => {
        return results;
      })
      .catch(err => {
        return results;
      })
  }
}

module.exports = new ExecuteRequest()

