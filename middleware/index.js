let log = console.log;
let campground =  require('../models/campground')
let comment =  require('../models/comments')

let middlewareObj = {}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error', 'please login here first')
      res.redirect('/login');
}
middlewareObj.authorizedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        campground.findById(req.params.id, (err, campground) => {
          if (err || !campground) {
            req.flash('error', 'Campground not found')
            res.redirect('/index')
          } else {
            if (campground.author.id.equals(req.user._id)) {
              next();
            } else {
              req.flash('error', 'permission denied')
              res.redirect('back');
            }
          }
        });
      } else {
        req.flash('error', 'you need to be logged in')
        res.redirect('back');
      }
}
middlewareObj.authorizedUserComment = (req, res, next) => {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, (err, campground) => {
          if (err) {
            log(err);
          } else {
            if (campground.author.id.equals(req.user._id)) {
              next();
            } else {
              req.flash('error', 'permission denied')
              res.redirect('back');
            }
          }
        });
      } else {
        req.flash('error', 'you need to be logged in to comment')
        res.redirect('back');
      }
}


module.exports = middlewareObj