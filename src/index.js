const path = require('path');
const { spawn } = require('child_process');
const express = require('express')
const gpio = require('onoff').Gpio;
const app = express()
const port = 3001

let out18 = {
    writeSync: () => {
        throw ('no gpio')
    }
}

try {
    out18 = new gpio(18, 'out');
} catch (err) {
    console.warn(err.message)
}

const open = (time) => {
    out18.writeSync(1);
    setTimeout(() => {
        out18.writeSync(0);
    }, time)
    return 'ok';
}

app.use('/', express.static(path.join(__dirname, 'www')));

app.get('/v1/gate/open', (req, res) => {
    try {
        const result = open(2000);
        res.status(200).send({ message: 'ok' })
    } catch (err) {
        res.status(503).send({ message: 'retry later' });
    }

    try {
        const fswebcam = spawn('fswebcam', ['-r', '640x360', '-S', '5', '--no-banner', '/home/pi/uc74-io/src/www/image.jpg']);
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
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))