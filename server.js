
const express = require('express')
const app = express()
// const { SerialPort } = require('serialport')
const plotting = require('./plotting');


// var Aport = new SerialPort({
//   path:"\\\\.\\COM5",
//   baudRate:9600
// });


const port = 3000

app.use(express.static('static'))
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
    res.send()
})

// all commands

app.post('/home', (req, res) => {
  // Aport.write("HOME\n");
  res.end();
})    

app.post('/move', (req, res) => {
  console.log(`MOVE X:${req.body.x} Y:${req.body.y} S:${req.body.s}\n`);
  // Aport.write(`MOVE X:${req.body.x} Y:${req.body.y} S:${req.body.s}\n`);
  res.end();
})    

app.post('/start', (req, res) => {
  plotting.star;
  res.end();
})    

// end

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
