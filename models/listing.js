const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:String,
    description:String,
    image:{
        type:String,
       
        set:(url)=>url===""?"https://media.istockphoto.com/id/1449032425/photo/shopping-bag-full-of-healthy-food-on-blue.jpg?s=1024x1024&w=is&k=20&c=1O0frg75q_i-00X30b4hr_G_JSwfWEXG40I9RZLyhoY=":url,
    },
    price: Number,
    rating:Number,
})

const ListingModel = mongoose.model("Listing",listingSchema);
module.exports = ListingModel;