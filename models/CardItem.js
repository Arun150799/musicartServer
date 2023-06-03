const mongoose = require('mongoose');

const cardID = new mongoose.Schema({
  cardId: String,
});

const productSchema = new mongoose.Schema({
    email: String,
    cardId:[
        cardID
    ]
  });
  



module.exports = mongoose.model('AddCardProduct', productSchema);
