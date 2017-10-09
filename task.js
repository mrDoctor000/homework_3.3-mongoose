const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var blogTaskSchema = new Schema({
  title: String,
  description: String,
  open: Boolean,
  user: { type: Schema.Types.ObjectId, ref: 'blogUsers' }
});

var blogTask = mongoose.model('blogTask', blogTaskSchema);

module.exports = blogTask;