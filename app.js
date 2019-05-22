const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

// load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

const app = express()

// connect to mongoose
mongoose.Promise = global.Promise // Map global promise - get rid of warning
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
}).then(() => {
  console.log('mongodb connected...')
}).catch(err => console.log(err))

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) // parse application/json

// method override middleware
app.use(methodOverride('_method'))

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
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

// use routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
