
const axios = require('axios');
const Promise = require('bluebird');

const StopWatch = require('./stop-watch')

class ExecuteRequest {

  execute(requests, client) {
    const results = [];

    const executeRequest = (request) => {
      const watch = new StopWatch();
      watch.start();
      return axios.get(request)
        .then(r => {
          const dur = watch.stop();
          console.log("executeRequest:", client, request)
          results.push({
            client: client,
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
            client: client,
            error: "" + e,
            url: request,
            status: status,
            duration: dur
          })
        })
    }

    return Promise.each(requests, (request) => {
      return executeRequest(request, client)
    })
      .then(r => {
        return results;
      })
      .catch(err => {
        return results;
      })
  }

  executeMultiClients(requests, countClients) {
    const promises = [];
    for (let client = 0; client < countClients; client++) {
      promises.push(this.execute(requests, client));
    }
    return Promise.all(promises)
  }
}

module.exports = new ExecuteRequest()

