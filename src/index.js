const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const gpio = require('onoff').Gpio;
const app = express();
const port = 3001;

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

app.use('/', express.static(path.join(__dirname, 'www')));

app.get('/v1/gate/open', (req, res) => {
  try {
    const result = open(2000);
    res.status(200).send({ message: 'ok' });
  } catch (err) {
    res.status(503).send({ message: 'retry later' });
  }

  try {
    const fswebcam = spawn('fswebcam', [
      '--skip', '5',
      '--no-banner',
      '--jpeg', '50',
      '--resolution', '960x540',
      '--rotate', '90',
      '--save', '/home/pi/uc74-io/src/www/image.jpg'
    ]);
    fswebcam.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    fswebcam.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    fswebcam.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    fswebcam.on('error', (error) => {
      console.log(error.code);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const http = require('http');
var httpServer = http.createServer(app);
httpServer.listen(8080);

// const https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(8443);

// const spdy = require('spdy');
// const options = {
//     key: fs.readFileSync(__dirname + '/server.key'),
//     cert: fs.readFileSync(__dirname + '/server.crt')
// }
// spdy
//     .createServer(options, app)
//     .listen(port, (error) => {
//         if (error) {
//             console.error(error)
//             return process.exit(1)
//         } else {
//             console.log('Listening on port: ' + port + '.')
//         }
//     })
