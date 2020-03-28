let log = console.log;

let express = require('express');
let router = express.Router();

let campground = require('../models/campground');
let comment = require('../models/comments');
let middleware = require('../middleware/index')

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//index page
router.get('/', (req, res) => {
  res.render('landing');
});

// campground page
router.get('/index', (req, res) => {
  campground.find({}, (err, camps) => {
    if (err) {
      log(err);
    } else {
      res.render('./campground/index', { campground: camps });
    }
  });
});
//campground post request page
//campground post request page
router.post('/index', middleware.isLoggedIn, (req, res) => {
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.desc;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      log(err)
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, price: price, image: image, desc: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/index");
        }
    });
  });
});
// form page
router.get('/index/new', middleware.isLoggedIn, (req, res) => {
  res.render('./campground/form');
});

//show more content about the camps
router.get('/index/:id', (req, res) => {
  campground
    .findById(req.params.id)
    .populate('comments')
    .exec((err, foundCamp) => {
      if (err || !foundCamp) {
        req.flash('error', 'campground not found')
        res.redirect('/index')
      } else {
        res.render('./campground/showDesc', { campground: foundCamp });
      }
    });
});

// edit camps

router.get('/index/:id/edit', middleware.authorizedUser, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    res.render('./campground/edit', { campground: campground });
  });
});

// update router
router.put('/index/:id', middleware.authorizedUser, (req, res) => {
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.lat = data[0].latitude;
    req.body.lng = data[0].longitude;
    req.body.location = data[0].formattedAddress;
    campground.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
      if (err) {
        log(err);
      } else {
        res.redirect('/index/' + req.params.id);
      }
    })
  });
});

//delete camps
router.delete('/index/:id', middleware.authorizedUser, (req, res) => {
  campground.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) {
      log(err);
    } else {
      if (deleted.author.id.equals(req.user._id)) {
        res.redirect('/index');
      } else {
        req.flash('error', 'permission denied')
        res.redirect('back')
      }
    }
  });
});

module.exports = router;
