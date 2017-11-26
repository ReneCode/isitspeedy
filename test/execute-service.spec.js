
const axios = require('axios');
const should = require('chai').should();
const sinon = require('sinon');

const executeService = require('../src/service/execute-service')

describe('executeService', () => {
  const requests = [
    "https://google.com",
    "https://bing.com"
  ]


  describe('#run', () => {

    let sandbox;
    let stubGet;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      stubGet = sandbox.stub(axios, 'get').resolves({
        status: 200
      })
    })
    afterEach(() => {
      sandbox.restore();
    })

    it('runSingleClient', () => {
      return executeService.runSingleClient(requests, {}, 42)
        .then(result => {
          result.should.be.a('array')
          result.length.should.be.equal(2)
          result[0].url.should.be.equal(requests[0])
          result[0].client.should.be.equal(42)
        })
    })

    it('runSingleClient should set headers', () => {
      const headers = {
        auth: "secrect"
      }
      return executeService.runSingleClient(requests, {
        headers: headers
      }, 1)
        .then(result => {
          stubGet.getCall(0).args[0].should.be.equal(requests[0])
          stubGet.getCall(0).args[1].should.be.deep.equal({
            headers: headers
          })
        })
    })

    it('execute for 1 (default) clients', () => {
      const config = {
        requests: requests,
      }
      return executeService.execute(config)
        .then(result => {
          result.should.be.a('array')
          result.length.should.be.equal(2 * 1)
        })
    })

    it('execute for 3 clients', () => {
      const config = {
        requests: requests,
        clients: 3
      }
      return executeService.execute(config)
        .then(result => {
          result.should.be.a('array')
          result.length.should.be.equal(2 * 3)
        })
    })

    it('execute with header', () => {
      const config = {
        requests: requests,
        clients: 3,
        header: {
          abc: "a-b-c"
        }
      }
      return executeService.execute(config)
        .then(result => {
          result.should.be.a('array')
          result.length.should.be.equal(2 * 3)
        })
    })
  })

  describe('#aggregateResults', () => {
    const resultsIn = [
      {
        url: 'https://bing.com',
        duration: 5
      },
      {
        url: 'https://google.com',
        duration: 10
      },
      {
        url: 'https://google.com',
        duration: 30
      },
      {
        url: 'https://google.com',
        duration: 50
      }];

    it('aggregateResults', () => {
      const results = executeService.aggregateResults(resultsIn, 'detail')
      results.should.be.deep.equal(resultsIn);
    })

    it("aggregateResults 'summary'", () => {
      const expect = [
        {
          url: 'https://bing.com',
          maxDuration: 5,
          minDuration: 5,
          avgDuration: 5
        },
        {
          url: 'https://google.com',
          maxDuration: 50,
          minDuration: 10,
          avgDuration: 30
        }];
      let results = executeService.aggregateResults(resultsIn, 'summary')
      results.should.be.a('array')
      results.should.be.deep.equal(expect)
    })
  })

})
