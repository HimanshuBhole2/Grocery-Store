const {listingSchema,reviewSchema} = require("./schema.js");
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

module.exports.isRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}