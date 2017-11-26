const axios = require('axios');
const Promise = require('bluebird');

const StopWatch = require('../utility/stop-watch')


class ExecuteService {

  runSingleClient(requests, options, client) {
    const results = [];

    const executeRequest = (request) => {
      const watch = new StopWatch();
      watch.start();
      return axios.get(request, options)
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

  execute(config) {
    let requests = config.requests;
    let countClients = config.clients || 1;

    if (!(requests && Array.isArray(requests) && requests.length > 0)) {
      return Promise.reject("requests missing");
    }

    if (requests.length * countClients > 100) {
      return Promise.reject("too many requests / clients");
    }

    const headers = config.headers;
    const options = {
      headers: headers
    };

    const promises = [];
    for (let client = 0; client < countClients; client++) {
      promises.push(this.runSingleClient(requests, options, client));
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

    const summarize = () => {
      const result = {}
      results.forEach(r => {
        const key = r.url
        if (!result[key]) {
          result[key] = {
            url: key,
            durations: []
          }
        }
        let entry = result[key];
        entry.durations.push(r.duration)
      })
      const summarizedData = []
      for (let p in result) {
        let data = result[p]
        let min = data.durations[0]
        let max = data.durations[0]
        let sum = 0
        data.durations.forEach(d => {
          min = Math.min(min, d)
          max = Math.max(min, d)
          sum += d
        })
        data.maxDuration = max
        data.minDuration = min
        data.avgDuration = sum / data.durations.length

        delete data.durations

        summarizedData.push(data)
      }
      return summarizedData
    }

    switch (mode) {
      case 'detail':
        return results;
      case 'summary':
        return summarize(results);
      default:
        return results;
    }
  }
}

module.exports = new ExecuteService()
