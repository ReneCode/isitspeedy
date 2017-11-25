
const axios = require('axios');
const should = require('chai').should();
const sinon = require('sinon');

const executeService = require('../src/service/execute-service')

describe('executeService', () => {
  const requests = [
    "https://google.com",
    "https://bing.com"
  ]

  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const stub = new Promise((r) => {
      r({
        status: 200
      });
    })
    sandbox.stub(axios, 'get').returns(stub)

  })
  afterEach(() => {
    sandbox.restore();
  })

  it('runSingleClient', () => {
    return executeService.runSingleClient(requests, 42)
      .then(result => {
        result.should.be.a('array')
        result.length.should.be.equal(2)
        result[0].url.should.be.equal(requests[0])
        result[0].client.should.be.equal(42)
      })
  })

  it('runMultiClients', () => {
    return executeService.runMultiClients(requests, 3)
      .then(result => {
        result.should.be.a('array')
        result.length.should.be.equal(2 * 3)
      })
  })

  describe('#aggregateResults', () => {
    const resultsIn = [
      {
        url: 'https://google.com',
        duration: 10
      },
      {
        url: 'https://google.com',
        duration: 20
      },
      {
        url: 'https://google.com',
        duration: 50
      }];
    it('aggregateResults', () => {
      return executeService.aggregateResults(resultsIn, 'detail')
        .then(results => {
          results.should.be.deep.equal(resultsIn);
        })
    })

    it.skip("aggregateResults 'summary'", () => {
      const expect = [
        {
          url: 'https://google.com',
          maxDuration: 50,
          minDuration: 50,
          avgDuration: 50
        }];
      return executeService.aggregateResults(resultsIn, 'summary')
        .then(results => {
          results.should.be.a('object')
        })
    })
  })

})
