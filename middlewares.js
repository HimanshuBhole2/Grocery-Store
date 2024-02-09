const ListingModel = require("./models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ReviewModel = require("./models/review.js");
const ExpressError = require("./utils/expressError");
const express = require("express")
const router = express.Router();


module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateReview= (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Must be Loggin First !");
        return res.redirect("/login");
    }
    next()
}

module.exports.isRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing1 =await ListingModel.findById(id);
    if(!res.locals.currUser._id.equals(listing1.owner)){
        req.flash("error","You are not Authorized to Make Change");
        return res.redirect(`/listings`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let{reviewId,id}= req.params;
    let review = await ReviewModel.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not owner")
           return  res.redirect(`/listings/${id}/show`);
    }
    next();
}