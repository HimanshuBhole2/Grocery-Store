const mongoose = require("mongoose");
const ReviewModel = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title:String,
    description:String,
    image:{
        type:String,
       
        set:(url)=>url===""?"https://media.istockphoto.com/id/1449032425/photo/shopping-bag-full-of-healthy-food-on-blue.jpg?s=1024x1024&w=is&k=20&c=1O0frg75q_i-00X30b4hr_G_JSwfWEXG40I9RZLyhoY=":url,
    },
    price: Number,
    rating:Number,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
})

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await ReviewModel.deleteMany({_id:{$in:listing.reviews}})
    }
})

const ListingModel = mongoose.model("Listing",listingSchema);
module.exports = ListingModel;