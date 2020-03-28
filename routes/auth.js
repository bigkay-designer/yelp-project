let log = console.log

let express = require('express');
let router = express.Router()
let passport = require('passport')

let campground = require('../models/campground')
let comment = require('../models/comments')
let middleware = require('../middleware')
let user = require('../models/user')

//===============================================//
  // Auth Routes

  router.get('/secret', middleware.isLoggedIn, (req, res) => {
    res.render('secret')
  })
  
  router.get('/register', (req, res) => {
    res.render('register')
  })
    //post signup
  router.post('/register', (req, res) => {
    user.register(new user({username: req.body.username}), req.body.password, (err, user)=>{
      if (err) {
        req.flash('error' , 'username taken try another one')
        return res.redirect('/register')
      }
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'welcome ' + req.user.username)
        res.redirect('/index')
      })
    })
  })
  
  // login
  router.get('/login', (req, res) => {
    res.render('login' )
  })
  // loging post
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login'
  }), (req, res) => {
    req.flash('sucess', 'you are succuessfly logged in')
  })
  
  //logout
  router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'logged out successfuly')
    res.redirect('/index')
  })


  module.exports = router