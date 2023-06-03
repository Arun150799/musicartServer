const express = require("express")
const cors  = require("cors")
const mongoose = require("./config/mongoose");
const User = require('./models/User');
const Product = require("./models/Job")
const AddToCart = require("./models/CardItem")
const BuyNow = require("./models/BuyNow")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const checkToken = require("./middleware/auth")
const dotenv = require('dotenv');
dotenv.config()



const app = express()

app.use(express.json())
app.use(cors())



app.post("/register", async (req, resp) => {

    try {
      const name = req.body.name;
      const number = req.body.number;
      const email = req.body.email;
      const password = req.body.password;
  
  
      if (!(name || number || email || password)) {
        resp.status(400).send("please fill correct details")
      }
  
      const oldUser = await User.findOne({ email})
      if (oldUser) {
        resp.status(200).send("this user is already  axist,please login")
      }
      let encryptedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({
        // id: Date.now().toString(),
        name: req.body.name,
        number: req.body.number,
        email: req.body.email,
        password: encryptedPassword
      })
      console.log(user);
       resp.send(user)
  
    }
    catch (error) {
      console.log(error);
    }
  })

  app.post("/login", async(req, resp) => { 
    try {
      const { email, password } = req.body;
      if (!(email || password)) {
          resp.status(400).send("fill all details correctly")
      }
      const user = await User.findOne({ email });
      if (user && bcrypt.compare(password, user.password)) {
          const token = jwt.sign({ email, password }, process.env.SECRETE_KEY, { expiresIn: "1h" })

          console.log(token);
  
           resp.status(200).send(user);
  
      }
      // return resp.status(400).send("invalid details")
  
  
  }
  catch (error) {
      console.log(error);
  }
  
  })

  app.get("/productList", async (req, resp) => {
  const filters = {};

  if (req.query.headPhoneType) {
    filters.productType = req.query.headPhoneType;
  }

  if (req.query.companyType) {
    filters.productBrand = req.query.companyType;
  }

  if (req.query.headPhoneColor) {
    filters.productColour = req.query.headPhoneColor;
  }

  if (req.query.headPhonePrice) {
    const priceRange = req.query.headPhonePrice.split("-");
    filters.productPrice = {
      $gte: priceRange[0],
      $lte: priceRange[1],
    };
  }

  const sortOption = req.query.sortOption; // Assuming a query parameter for sort option

  try {
    let productDetails;
    
     if (sortOption === "highestPrice") {
      productDetails = await Product.find(filters).sort("-productPrice").limit(1);
    } 
    else if (sortOption === "lowestPrice") {
      productDetails = await Product.find(filters).sort("productPrice").limit(1);
    }
     else if (sortOption === "productName") {
      productDetails = await Product.find(filters).sort("productName");
    }
     else if (sortOption === "-productName") {
      productDetails = await Product.find(filters).sort("-productName");
    } 
    
     else {
      productDetails = await Product.find(filters);
    }

    resp.status(200).send(productDetails);
  } catch (error) {
    resp.status(400).send(error.message);
  }
});



    

  app.get("/search/:key",async(req,resp)=>{
    let result =await Product.find({ 
      "$or":[
        {
        productName:{ $regex: req.params.key},
      },
      {
        productPrice:{ $regex: req.params.key},

      },
      {
        productBrand:{ $regex: req.params.key}

      },
      {
        productType:{ $regex: req.params.key}

      }
    ]
    })
    resp.send(result);
  });

  app.get("/productOne/:id",async(req,resp)=>{
    let result =await Product.findOne({_id:req.params.id})
    if(result){
      resp.send(result)
    }
    else{
      resp.send({result:"no such product found"})
    }
  })

  app.post("/addToCart",async(req,resp)=>{
    const email = req.body.email;
    const id =  req.body.id;
    const AlreadyAddToCartProductId = await AddToCart.findOne({
      cardId: { $elemMatch: { cardId: id} },
    });
    console.log(AlreadyAddToCartProductId+"13");
    console.log(req.body.id);
  
    const AlreadyAddToCartProductEmail = await AddToCart.findOne({
      email,
    });
  
    const AlreadyAddToCartProduct = await AddToCart.findOne({
      email: req.body.email,
      cardId: { $elemMatch: { cardId: req.body.id } },
    });
  if (AlreadyAddToCartProduct) {
    console.log("this product is already in your cart");

    resp.status(200).json("this product is already in your cart")
  } else if (
    AlreadyAddToCartProductEmail !== null &&
    AlreadyAddToCartProductId !== req.body.id
  ) {
    console.log("product id addd");
    AddToCart.updateOne(
      { email: req.body.email },
      {
        $push: {
          cardId: {
            cardId:req.body.id,
            productQuantity: 1,
          },
        },
      },
      { upsert: true }
    )
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
    resp.status(200).json("Product added Successfully");
  } else if (
    AlreadyAddToCartProductEmail === null &&
    req.body.id
  ) {
    console.log("cart create Successfully");
    await AddToCart.create({
      email:req.body.email,
      cardId:[
        {
          cardId:req.body.id,
          productQuantity:1
        } 
      ]
    })
    resp.status(200).json("Product added Successfully");
  }
    
  })

  app.get("/getCardId",async(req,resp)=>{
    const result =await AddToCart.find()
    if(result){
      resp.send(result)
    }
  })

  app.post("/buyNow",async(req,resp)=>{
    const email = req.body.email;
    const id =  req.body.id;
    const AlreadyAddToCartProductId = await BuyNow.findOne({
      cardId: { $elemMatch: { cardId: id} },
    });
    console.log(AlreadyAddToCartProductId+"13");
    console.log(req.body.id);
  
    const AlreadyAddToCartProductEmail = await BuyNow.findOne({
      email,
    });
  
    const AlreadyAddToCartProduct = await BuyNow.findOne({
      email: req.body.email,
      cardId: { $elemMatch: { cardId: req.body.id } },
    });
  if (AlreadyAddToCartProduct) {
   
    console.log("cart create Successfully1");
    await BuyNow.create({
      email:req.body.email,
      cardId:[
        {
          cardId:req.body.id,
        } 
      ]
    })
    resp.status(200).json("Product added Successfully1");
    
  } else if (
    AlreadyAddToCartProductEmail !== null &&
    AlreadyAddToCartProductId !== req.body.id
  ) {
     
    console.log("cart create Successfully2");
    await BuyNow.create({
      email:req.body.email,
      cardId:[
        {
          cardId:req.body.id,
        } 
      ]
    })
    resp.status(200).json("Product added Successfully2");
      
  } else if (
    AlreadyAddToCartProductEmail === null &&
    req.body.id
  ) {
    console.log("cart create Successfully3");
    await BuyNow.create({
      email:req.body.email,
      cardId:[
        {
          cardId:req.body.id,
        } 
      ]
    })
    resp.status(200).json("Product added Successfully3");
  }
    
  })

  app.get("/getBuyNow",async(req,resp)=>{
    const result1 =await BuyNow.find()
    if(result1){
      resp.send(result1)
    }
  })




app.listen(6900)