const express = require('express')
const app = express()
const port = 3000

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.send()
})

app.post('/', (req, res) => {
  console.log(res)
  res.status(201).send('sdfkvjhnb')
})    

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
