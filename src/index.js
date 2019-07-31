const path = require('path');
const express = require('express')
const gpio = require('onoff').Gpio;

const app = express()
const port = 3001

let out18 = {
    writeSync: () => {throw('no gpio')}
}

try {
    out18 = new gpio(18, 'out');
} catch(err){
    console.warn(err.message)
}

const open =(time) => {
    out18.writeSync(1);
    setTimeout(() => {
        out18.writeSync(0);
    }, time)
    return 'ok';
}


app.use('/', express.static(path.join(__dirname, 'www')));

app.get('/v1/gate/open', (req, res) => {
    try{
        const result = open(2000);
        res.status(200).send('ok')
    }catch(err){
        res.status(503).send('retry later');
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))