const mongoose = require('mongoose');



const jobSchema = new mongoose.Schema({
    
    productName: String,
    productFullName: String,
    productBrand: String,
    productPrice: String,
    productColour:String,
    productDeliverAt:String,
    productDetails1:String,
    productDetails2:String,
    productDetails3:String,
    productDetails4:String,
    productDetails5:String,
    productDetails6:String,
    productDetails:String,
    productType:String,
    productURL1: String,
    productURL2: String, 
    productURL3: String,
    productURL:String,
    productDeliverCharge:String
})

module.exports = mongoose.model('Product', jobSchema);

