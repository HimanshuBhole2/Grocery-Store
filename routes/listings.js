const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const ListingModel = require("../models/listing.js");
const {validateReview,validateListing }= require("../middlewares.js");
// const flash = require("connect-flash");

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
    req.flash('success',"Listing Updated Successfully");
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
    req.flash("success","List Updated Successfully");
    res.redirect(`/listings/${id}/show`);
}))

// Delete the item 
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    req.flash("success","list is Deleted Successfully");
    res.redirect("/listings");
}))


module.exports = router;