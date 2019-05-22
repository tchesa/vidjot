const express = require('express')
const router = express.Router()

// user login route
router.get('/login', (req, res) => {
  res.render('users/login')
})

// user register route
router.get('/register', (req, res) => {
  res.render('users/register')
})

// register form POST
router.post('/register', (req, res) => {
  let errors = []
  if (req.body.password !== req.body.confirmPassword) errors.push({text: 'Passwords do not match'})
  if (req.body.password.length < 4) errors.push({text: 'Password must be at least 4 characters'})

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    })
  } else {
    res.send('passed')
  }
})

module.exports = router
