
const express = require('express')
const app = express()
const { SerialPort } = require('serialport')


var Aport = new SerialPort({
  path:"\\\\.\\COM5",
  baudRate:9600
});


const port = 3000

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.send()
})

// all commands

app.post('/home', (req, res) => {
  console.log("jaaaj");
  Aport.write("H");
})    

// end

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
