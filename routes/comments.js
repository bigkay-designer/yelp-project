let log = console.log;

let express = require('express');
let router = express.Router();

let campground = require('../models/campground');
let comment = require('../models/comments');
let middleware = require('../middleware')

// =====================//
// comments

router.get('/index/:id/comment/newcomment', middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      log;
    } else {
      log(campground);
      res.render('./comment/newcomment', { campground: campground });
    }
  });
}); // post comment

router.post('/index/:id/comment', middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      log(err);
    } else {
      comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'something went wrong');
        } else {

          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()
          campground.comments.push(comment);
          campground.save();
          req.flash('sucess', 'successfully added comment')
          res.redirect('/index/' + campground._id);
        }
      });
    }
  });
});

router.delete('/index/:id/comment/:comment_id',middleware.authorizedUserComment, (req, res) => {
  comment.findByIdAndDelete(req.params.comment_id, (err, deleted) => {
    if (err) {
      res.redirect('back')
    } else {
      req.flash('success', 'comment deleted')
      res.redirect('/index/' + req.params.id)
    }
  })
});

module.exports = router;
