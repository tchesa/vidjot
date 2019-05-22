const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()

// Map global promise - get rid of warning
mongoose.Promise = global.Promise
// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB Connected...')
}).catch(err => console.log(err))

// load idea model
require('./models/idea')
const Idea = mongoose.model('ideas')

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// index route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title: title
  })
})

// about route
app.get('/about', (req, res) => {
  res.render('about')
})

// add idea form
app.get('/ideas/add', (req, res) => {

  res.render('ideas/add')
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
