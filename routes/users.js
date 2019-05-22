const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// load user model
require('../models/user')
const User = mongoose.model('users')

// user login route
router.get('/login', (req, res) => {
  res.render('users/login')
})

// user register route
router.get('/register', (req, res) => {
  res.render('users/register')
})

// login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
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
    User.findOne({email: req.body.email}).then(user => {
      if (user) {
        req.flash('error_msg', 'E-mail already registered')
        res.redirect('/users/register')
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        }
        bcrypt.genSalt(10,(err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            new User(newUser).save().then(user => {
              req.flash('success_msg', 'You are now registered and can log in')
              res.redirect('/users/login')
            }).catch(err => {
              console.log(err)
              return;
            })
          })
        })
      }
    })
  }
})

module.exports = router
