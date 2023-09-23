const mongoose = require("mongoose");
// const MONGO_DB_URI = 'mongodb+srv://himanshuMongo:himpass@myfirstcluster.urmejyo.mongodb.net/shop?retryWrites=true&w=majority';
const MONGO_DB_URI = 'mongodb://127.0.0.1:27017/OurApp';
const mongoConnect = (callback)=>{
    console.log("req sent");
    mongoose.connect(MONGO_DB_URI)
        .then(client=>{
            console.log("connected to Mongo DB Sucessfully....");
            // _db = client.db();
            callback();
        })
        .catch(err=>{
            console.log(err);
        })
}
module.exports = mongoConnect;