
const axios = require('axios');
const should = require('chai').should();

const URL = 'http://localhost:3102/';

describe('home-route', () => {
  it('should start server', () => {
    return axios.get(URL)
      .then(result => {
        result.data.should.contain('is it speedy - backend');
      })
  })
})