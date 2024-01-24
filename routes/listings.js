const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const ListingModel = require("../models/listing.js");
const ReviewModel = require("../models/review.js");
const {validateReview,validateListing }= require("../middlewares.js");



// Listing field

router.get("/",async (req,res)=>{
    let listings = await ListingModel.find({});
    res.render("listings/index.ejs",{listings});
})

// Show the grocery
router.get("/:id/show",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing =await ListingModel.findById(id).populate("reviews");
    if(!listing){
        throw new ExpressError(404,"Page NOt Exist");
    }
    res.render("listings/show.ejs",{listing})
}))


// Add New Listings
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{

    let listing1 = new ListingModel(req.body.listing)
    await listing1.save();
    res.redirect("/listings");
}))

// Edit The Route

router.get("/:id/edit",wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if(!listing){
        throw new ExpressError(404,"Page Not Exist !!")
    }
    res.render("listings/edit.ejs",{listing});
}))

router.put("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}/show`);
}))

// Delete the item 
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    res.redirect("/listings");
}))


module.exports = router;