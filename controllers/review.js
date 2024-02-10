const ReviewModel = require("../models/review.js");
const ListingModel = require("../models/listing.js");


module.exports.deleteReview =async(req,res)=>{
    let{id,reviewId}= req.params;
    await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully.")
    res.redirect(`/listings/${id}/show`);

}

module.exports.addReview = async(req,res)=>{
    let {id} = req.params;
   let review1 = new ReviewModel(req.body.review);
   review1.author= req.user;
   await review1.save();
   let listing1 =await ListingModel.findById(id).populate("reviews");
    listing1.reviews.push(review1);
    await listing1.save();
    req.flash("success","Review Added Successfully.")
   return res.redirect(`/listings/${listing1._id}/show`);
}