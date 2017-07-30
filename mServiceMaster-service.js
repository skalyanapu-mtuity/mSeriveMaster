/**
* @name MServiceMaster
* @summary MServiceMaster Hydra Express service entry point
* @description 
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');

const jwtAuth = require('fwsp-jwt-auth');
const HydraExpressLogger = require('fwsp-logger').HydraExpressLogger;
hydraExpress.use(new HydraExpressLogger());

let config = require('fwsp-config');

/**
* Load configuration file and initialize hydraExpress app
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
    return jwtAuth.loadCerts(null, config.jwtPublicCert);
  })
  .then(status => {
    return hydraExpress.init(config.getObject(), version, () => {
      const app = hydraExpress.getExpressApp();
      app.set('views', './views');
      app.set('view engine', 'pug');
      hydraExpress.registerRoutes({
        '/v1/mServiceMaster': require('./routes/mServiceMaster-v1-routes')
      });
    });
  })
  .then(serviceInfo => console.log('serviceInfo', serviceInfo))
  .catch(err => console.log('err', err));
