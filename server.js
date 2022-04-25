const express = require('express')
const app = express()
const port = 3000

app.use(express.static('static'))

app.get('/', (req, res) => {
    res.send()
})

app.post('/home', (req, res) => {
  console.log("jaaj")
})    

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
