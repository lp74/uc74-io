const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const getShot = require('./get-shot');
const gpio = require('onoff').Gpio;
const app = express();
const dotenv = require('dotenv');
dotenv.config();

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

const open = (time) => {
  out18.writeSync(1);
  setTimeout(() => {
    out18.writeSync(0);
  }, time);
  return 'ok';
};

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'www'), { dotfiles: 'allow' }));

app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.params);
  console.log(req.query);
  console.log(req.body);
  console.log(req.cookies);
  next();
});

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

app.get('/v1/gate/shot', checkTocken, async (req, res) => {
  try {
    const code = await getShot();
    switch (code) {
    case 0:
      res.status(200).sendFile('/home/pi/uc74-io/www/image.jpg');
      break;
    default:
      res.status(200).send(code.toString());
      break;
    }
  } catch (error) {
    res.status(503).send(error);
  }
});

app.get('/v1/gate/open', checkTocken, (req, res) => {
  try {
    const result = open(2000);
    res.status(200).send({ message: 'ok' });
  } catch (err) {
    res.status(503).send({ message: 'retry later' });
  }
  getShot().then(console.log).catch(console.error);
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

