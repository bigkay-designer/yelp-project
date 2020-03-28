require('dotenv').config()

let log = console.log;
//========================
// including packegs
//========================

let express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  passport = require('passport'),
  localStragety = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
//models files and extenal files
campground = require('./models/campground'),
  comment = require('./models/comments'),
  seedDB = require('./seeds'),
  user = require('./models/user');

// Routes
let campgroundRout = require('./routes/campgrounds'),
  commentRouter = require('./routes/comments'),
  authRouter = require('./routes/auth');
// seedDB() // adding seeds data

// Connect to the database
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

(app = express());
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

/// Passport Auths
app.use(
  require('express-session')({
    secret: 'i love hanna',
    resave: false,
    saveUninitialized: false
  })
);

// configuring passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStragety(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// middleWare for nav bar links
app.use((req, res, next) => {
  res.locals.currentuser = req.user;
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next();
});
// using the routes
app.use(campgroundRout);
app.use(commentRouter);
app.use(authRouter);

// routes

app.delete('/index/:id', (req, res) => {
  campground.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) {
      log(err);
    } else {
      res.redirect('/index');
    }
  });
});

//============================================
// redirect all wrong urls to here
app.get('*', (req, res) => {
  res.send('oops you came to the wrong page');
});

//==============================
// set the port
app.listen(3000, () => {
  console.log('server has started');
});
