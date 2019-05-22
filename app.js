const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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

// body parser middleware
app.use(bodyParser.urlencoded({ extend: false }))
app.use(bodyParser.json()) // parse application/json

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

// process form - handle post idea
app.post('/ideas', (req, res) => {
  let errors = []
  if (!req.body.title) errors.push({text: 'Please add a title'})
  if (!req.body.details) errors.push({text: 'Please add some details'})

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    res.send('passed')
  }
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
