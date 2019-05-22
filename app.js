const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()

// Map global promise - get rid of warning
mongoose.Promise = global.Promise
// connect to mongoose
mongoose.connect('mongodb://localhost:5001/vidjot-dev', {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB Connected...')
}).catch(err => console.log(err))

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title: title
  })
})

// About Route
app.get('/about', (req, res) => {
  res.render('about')
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
