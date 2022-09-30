
const express = require('express')
const app = express()
const { SerialPort } = require('serialport')
const plotting = require('./plotting');
const bodyParser = require('body-parser') 
const fs = require('fs');

var plottingStarted = false;

var Aport = new SerialPort({
   path:"\\\\.\\COM5",
   baudRate:115200
 });


const port = 3000

app.use(express.static('static'))
app.use(express.json({limit: '2500mb'}));
app.use(express.urlencoded({limit: '2500mb'}));

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
  console.log(JSON.parse(req.body.c));
  plotting.start(JSON.parse(req.body.c), Aport);
  plottingStarted = true;
  res.end();
})    

app.get('/get_color_table', (req, res) => {
  const data = fs.readFileSync('./color_table.json', 'utf8');
  let json = JSON.parse(data);
  return res.json(json)
})    

app.get('/get_tool_take_script', (req, res) => {
  const data = fs.readFileSync('./tool_take.pr', 'utf8');
  return res.json(data)
})    

app.get('/get_tool_remove_script', (req, res) => {
  const data = fs.readFileSync('./tool_remove.pr', 'utf8');
  return res.json(data)
})    


// end

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

Aport.on('data', (data) => {
  if (data == "g")
  {
    Aport.write(plotting.actions[plotting.currentAction]);
    plotting.currentAction += 1
  }
})
