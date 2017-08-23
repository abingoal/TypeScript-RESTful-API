import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as mocha from 'mocha';

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/users', () => {

  it('responds with JSON array', () => {
    return chai.request(app).get('/api/v1/users')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(5);
      });
  });

  it('should include abing', () => {
    return chai.request(app).get('/api/v1/users')
      .then((res) => {
        const abing = res.body.find((user) => user.name === 'abing');
        expect(abing).to.exist;
        expect(abing).to.have.all.keys([
          'id',
          'name'
        ]);
      });
  });

});
describe('GET api/v1/users/:id', () => {

  it('responds with single JSON object', () => {
    return chai.request(app).get('/api/v1/users/1')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
      });
  });

  it('should return abing', () => {
    return chai.request(app).get('/api/v1/users/1')
      .then((res) => {
        expect(res.body.hero.name).to.equal('abing');
      });
  });

});
