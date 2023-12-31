const mongoose =require("mongoose");
const Schema = mongoose.Schema;

reviewSchema = mongoose.Schema({
    comment:String,

    rating: {
        type:Number,
        max:5,
        min:1
    },

    createdAt : {
        type:Date,
        default:Date.now(),
    }

})

const ReviewModel = mongoose.model("Review",reviewSchema);

module.exports = ReviewModel;