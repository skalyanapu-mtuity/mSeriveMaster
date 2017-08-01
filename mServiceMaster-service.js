/**
* @name MServiceMaster
* @summary MServiceMaster Hydra Express service entry point
* @description
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');
const subpath = require('express');
const jwtAuth = require('fwsp-jwt-auth');
const HydraExpressLogger = require('fwsp-logger').HydraExpressLogger;
const argv = require('minimist')(process.argv.slice(2));
const bodyParser = require( 'body-parser' );
const swagger = require('swagger-node-express').createNew(subpath);
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
      app.use(bodyParser());
      hydraExpress.registerRoutes({
        '/v1/mServiceMaster': require('./routes/mServiceMaster-v1-routes')
      });
    });
  })
  .then(serviceInfo =>{
    console.log('serviceInfo', serviceInfo);
    //swagger.configureSwaggerPaths('', 'api-docs', '');

    // Configure the API domain
    var domain = 'localhost';
    if(argv.domain !== undefined)
      domain = argv.domain;
    else
      console.log('No --domain=xxx specified, taking default hostname "localhost".')

    // Configure the API port
    var port = serviceInfo.servicePort;
    if(argv.port !== undefined)
      port = argv.port;
    else
      console.log('No --port=xxx specified, taking default port ' + port + '.')

    // Set and display the application URL
    // var applicationUrl = 'http://' + domain + ':' + port;
    // console.log('snapJob API running on ' + applicationUrl);
    // swagger.configure(applicationUrl, '1.0.0');
  })
  .catch(err => console.log('err', err));

module.exports = hydraExpress.getExpressApp();
