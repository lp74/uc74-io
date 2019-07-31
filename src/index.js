const path = require('path');

const express = require('express')
const app = express()
const port = 3001

app.use('/', express.static(path.join(__dirname, 'www')));

app.get('/v1/gate/open', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))