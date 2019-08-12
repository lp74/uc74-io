require('dotenv').config();

const dns = require('dns');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const gpio = require('onoff').Gpio;
const app = express();

const actionLog = require('./action-log');

const { checkTocken, signToken } = require('./jwt');

let out18 = {
  writeSync: () => {
    throw ('no gpio');
  }
};

try {
  out18 = new gpio(18, 'out');
} catch (err) {
  console.warn(err.message);
}

const ioGateOpen = (time) => {
  out18.writeSync(1);
  setTimeout(() => {
    out18.writeSync(0);
  }, time);
  return 'ok';
};

const logging = (req, res, next) => {
  console.log('url', req.url);
  console.log('query', req.query);
  console.log('params', req.params);
  console.log('cookies', req.cookies);
  console.log('body', req.body);

  next();
};

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logging);
app.use('/', express.static(process.env.SERVER_FOLDER, { dotfiles: 'allow' }));

// Endpoints
app.post('/v1/sign', (req, res, next) => {
  const { email, password } = req.body;
  if (process.env.JWT_EMAIL === email && process.env.JWT_PWD === password) {
    const token = signToken(email);
    res.cookie('token', token, { maxAge: process.env.JWT_EXP * 1000 });
    res.end();
  }
  else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

app.get('/v1/dns', (req, res) => {
  dns.lookup('gate74.ddns.net', (err, address) => {
    if (err) {
      res.status(503).send(err);
    }
    res.status(200).send(address.toString());
  });
});

app.post('/v1/gate/open', checkTocken, (req, res) => {
  action = { type: 'GATE_OPEN', payload: Object.assign({}, { ip: req.ip }, req.user, req.body) };
  actionLog(action);

  getShot()
    .then(console.log)
    .catch(console.error);

  try {
    const result = ioGateOpen(2000);
    res.status(200).send({ message: result });
  } catch (err) {
    res.status(503).send({ message: 'retry later' });
  }
});

const https = require('https');
var privateKey = fs.readFileSync(process.env.SERVER_KEY);
var certificate = fs.readFileSync(process.env.SERVER_CRT);

var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.HTTPS_PORT);

const http = express();
http.get('*', function (req, res) {
  console.log(req.headers);
  res.redirect('https://' + req.headers.host.replace(`:${process.env.HTTP_PORT}`, `:${process.env.HTTPS_PORT}`) + req.url);
});
http.listen(process.env.HTTP_PORT);

