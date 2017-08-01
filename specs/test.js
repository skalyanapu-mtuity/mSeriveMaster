'use strict';

/**
* Change into specs folder so that file loading works.
*/
process.chdir('./specs');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
const express = require('./../mServiceMaster-service');;
const http = require('http');

// Tests go here.

var randomId = Math.floor(Math.random()*100)+0;
 describe('/GET JSON', () => {
  it('it should GET a randon JSON(post)', (done) => {
    chai.request('http://127.0.0.1:3000')
      .get('/v1/mServiceMaster/get-json/1')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
