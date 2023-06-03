const mongoose = require("mongoose")

const mongoURL ="mongodb+srv://arunsuryavanshi:DTAgW7QdsVCltEWG@cluster0.f8zqt7u.mongodb.net/musicart?retryWrites=true&w=majority"
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("MongoDb Atlas has been  connected successfully!");
})


module.exports =mongoose;         