const express = require('express');
const router = express.Router({mergeParams:true});


const ReviewModel = require("../models/review.js");
const ListingModel = require("../models/listing.js");
const {validateReview,isAuthor,isLoggedIn} = require("../middlewares.js");

router.delete("/:reviewId",isLoggedIn,isAuthor,async(req,res)=>{
        let{id,reviewId}= req.params;
        await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await ReviewModel.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}/show`);
    
    })

router.post("/",isLoggedIn,validateReview ,async(req,res)=>{
        let {id} = req.params;
       let review1 = new ReviewModel(req.body.review);
       review1.author= req.user;
       await review1.save();
       let listing1 =await ListingModel.findById(id).populate("reviews");
        listing1.reviews.push(review1);
        await listing1.save();
       return res.redirect(`/listings/${listing1._id}/show`);
    })


module.exports = router;