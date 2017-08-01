/**
 * @name mServiceMaster-v1-api
 * @description This module packages the MServiceMaster API.
 */
'use strict';

const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const jwtAuth = require('fwsp-jwt-auth');const ServerResponse = require('fwsp-server-response');

let serverResponse = new ServerResponse();
serverResponse.enableCORS(true);express.response.sendError = function(err) {
  serverResponse.sendServerError(this, {result: {error: err}});
};

express.response.sendOk = function(result) {
  serverResponse.sendOk(this, {result});
};

express.response.sendError = function(result) {
  serverResponse.sendServerError(this, {result});
};

let api = express.Router();
//hydraExpress.validateJwtToken()




api.get('/',
(req, res) => {
  res.sendOk({msg: `hello from ${hydra.getServiceName()} - ${hydra.getInstanceID()}`});
});


api.get('/get-json/:id',
  (req, res) => {
    console.log(req.params.id,'params addede !!');
    req.query.id = req.params.id;
    let message = hydra.createUMFMessage({
      to: 'mservice-service:[get]/v1/mService/fetch-json/',
      from: 'mServiceMaster-service:/',
      body: {
        'id':req.params.id
      }
    });
    return hydra.makeAPIRequest(message)
      .then((response) => {
        res.sendOk({msg:response});
      })
      .catch(err => {
        res.sendError(err);
      });
  });


module.exports = api;
