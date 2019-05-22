const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

// connect to mongoose
mongoose.Promise = global.Promise // Map global promise - get rid of warning
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
}).then(() => {
  console.log('mongodb connected...')
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

// method override middleware
app.use(methodOverride('_method'))

// express session middleware
app.use(session({
  secret: 'secret',
  reasve: true,
  saveUnitialized: true
}))

// connect flash middleware
app.use(flash())

// global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

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

// idea index page
app.get('/ideas', (req, res) => {
  Idea.find({}).sort({date: 'desc'}).then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    })
  })
})

// add idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

// edit idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', {idea: idea})
  })
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
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Video idea added')
      res.redirect('/ideas')
    })
  }
})

// edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id }).then(idea => {
    // new values
    idea.title = req.body.title
    idea.details = req.body.details
    idea.save().then(idea => {
      req.flash('success_msg', 'Video idea updated')
      res.redirect('/ideas')
    })
  })
})

// delete form process
app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({_id: req.params.id}).then(() => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
  })
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
