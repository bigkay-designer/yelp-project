let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    username: String
  }
});

module.exports = mongoose.model('comment', commentSchema);
 