const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var blogUserSchema = new Schema({
  name: String,
});

var blogUser = mongoose.model('blogUsers', blogUserSchema);

module.exports = blogUser;