const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  password:String
});



module.exports = mongoose.model('Customer', recipeSchema);

