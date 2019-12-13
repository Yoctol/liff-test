const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');
const path = require('path');
const ejs = require('ejs');
const querystring = require('querystring');

const app = bottender({
  dev: process.env.NODE_ENV !== 'production',
});
const port = Number(process.env.PORT) || 5000;

const handle = app.getRequestHandler();

function getParams(req) {
  const state = req.query['liff.state'];
  if (state) {
    const array = state.split('?');
    if (array.length == 2) {
      return querystring.parse(array[1]);
    }
  }

  return req.query || {};
}

app.prepare().then(() => {
  const server = express();
  server.use(express.static('public'));

  server.use(
    bodyParser.json({
      verify: (req, _, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );

  server.get('/api', (req, res) => {
    res.json({ ok: true });
  });

  server.get('/send-id', (req, res) => {
    if (req.query.registerFrom == 'lineLogin') {
      res.json({ id: process.env.LINE_LOGIN_LIFF_ID });
      return;
    }
    if (req.query.registerFrom == 'messagingApi') {
      res.json({ id: process.env.MESSAGING_API_LIFF_ID });
      return;
    }
    res.json({ id: 'error' });
  });

  server.get('/liff', (req, res) => {
    const params = getParams(req);
    const version = params.version || 'v2';
    const filename = path.join(__dirname + `/src/liff/${version}.html`);
    const data = {
      params,
      rootPath: process.env.ROOT_PATH
    }
    const options = {};
    ejs.renderFile(filename, data, options, function(err, str) {
      // str => Rendered HTML string
      res.send(str);
      if (err) {
        console.log(`error: ${JSON.stringify(err)}`);
      }
    });
  });

  server.get('/v1', (req, res) => {
    let params = getParams(req);
    const filename = path.join(__dirname + `/src/liff/v1.html`);
    const data = {
      params,
      rootPath: process.env.ROOT_PATH
    }
    const options = {};
    ejs.renderFile(filename, data, options, function(err, str) {
      // str => Rendered HTML string
      res.send(str);
      if (err) {
        console.log(`error: ${JSON.stringify(err)}`);
      }
    });
  });

  server.get('/v2', (req, res) => {
    let params = getParams(req);
    const filename = path.join(__dirname + `/src/liff/v2.html`);
    const data = {
      params,
      rootPath: process.env.ROOT_PATH
    }
    const options = {};
    ejs.renderFile(filename, data, options, function(err, str) {
      // str => Rendered HTML string
      res.send(str);
      if (err) {
        console.log(`error: ${JSON.stringify(err)}`);
      }
    });
  });

  server.get('/external', (req, res) => {
    const filename = path.join(__dirname + `/src/external.html`);
    const params = {
      lineLogin: process.env.LINE_LOGIN_LIFF_ID,
      messagingApi: process.env.MESSAGING_API_LIFF_ID,
    };
    const options = {};
    ejs.renderFile(filename, params, options, function(err, str) {
      // str => Rendered HTML string
      res.send(str);
      if (err) {
        console.log(`error: ${JSON.stringify(err)}`);
      }
    });
  });

  server.all('/webhooks/line', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
