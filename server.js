'use strict';

const https = require('https');
const fs = require('fs');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const { google } = require('googleapis');

/**
 * Google auth  (Oauth2) config
 */

const oauth2Client = new google.auth.OAuth2(
  '421488325802-8nmkr68netpv07rqt4i1aotoqhckjo9n.apps.googleusercontent.com',
  'bO8oDmTt8T6xwQx2MiD5YTC3',
  'https://localhost:3030'
);

const scopes = ['https://www.googleapis.com/auth/drive.appfolder'];

const googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: scopes
});


// SSL key and cert options for HTTPS
const httpOptions = {
  'key': fs.readFileSync('./ssl/server.key'),
  'cert': fs.readFileSync('./ssl/server.crt')
};

// Handlers for requested paths
const handlers = {}

handlers.login = function(data, callback) {
  const status = 200;
  const payload = { authUrl: googleAuthUrl };
  callback(status, payload);
}

handlers.nomatch = function() {}

// Routers
const router = {
  login: handlers.login
};

// Creates an HTTP server
const server = https.createServer(httpOptions, function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const trimmedPath = parsedUrl.path.replace(/\/+|\/+$/, '');
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', function(data) {
    buffer += decoder.decode(data);
  });
  req.on('end', function() {
    buffer += '';
    const reqData = {
      path: trimmedPath,
      method: req.method
    }
    const selectedHandler = router[trimmedPath] ? router[trimmedPath] : handlers.nomatch;
    selectedHandler(reqData, function(status, payload) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(status);
      res.end(JSON.stringify(payload));
    });
  });
});


// Run the server
server.listen(3030, function() {
  console.log('listening on 3030');
})