const axios = require('axios');
const Promise = require('bluebird');

const StopWatch = require('../utility/stop-watch')


class ExecuteService {

  runSingleClient(requests, client) {
    const results = [];

    const executeRequest = (request) => {
      const watch = new StopWatch();
      watch.start();
      return axios.get(request)
        .then(r => {
          const dur = watch.stop();
          // console.log("executeRequest:", client, request)
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

  runMultiClients(requests, countClients) {
    if (requests.length * countClients > 100) {
      return Promise.reject("too many requests / clients");
    }

    const promises = [];
    for (let client = 0; client < countClients; client++) {
      promises.push(this.runSingleClient(requests, client));
    }
    return Promise.all(promises)
      .then(r => {
        // put results from all clients together in one array
        let results = [];
        r.forEach(r => {
          results = results.concat(r)
        })
        return Promise.resolve(results)
      })
      .catch(err => Promise.reject(err))
  }


  aggregateResults(results, mode) {
    return Promise.resolve(results);
  }
}

module.exports = new ExecuteService()
