const { spawn } = require('child_process');

const defaultConf = [
  '--skip', '5',
  '--no-banner',
  '--jpeg', '50',
  '--resolution', '960x540',
  '--rotate', '90',
  '--save', '/home/pi/uc74-io/src/www/image.jpg'
];

module.exports = function getShot(conf = defaultConf) {
  return new Promise((resolve, reject) => {
    try {
      const fswebcam = spawn('fswebcam', conf);

      fswebcam.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      fswebcam.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      fswebcam.on('error', (error) => {
        reject(error);
        console.log(error.code);
      });

      fswebcam.on('close', (code) => {
        resolve(code);
        console.log(`child process exited with code ${code}`);
      });
    }
    catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
