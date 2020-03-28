let mongoose = require('mongoose');
//Schema setUp
let campGroundSchema = new mongoose.Schema({
  name: String,
  price:String,
  image: String,
  desc: String,
  location: String,
  lat: Number,
  lng: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    }
  ]
});
//passing Schema to to mongoose.model
let campground = mongoose.model('campground', campGroundSchema);

module.exports = campground;
