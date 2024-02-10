const ListingModel = require("../models/listing.js")
const User = require("../models/user.js")

module.exports.getListings = async (req,res)=>{
    let listings = await ListingModel.find({});
    res.render("listings/index.ejs",{listings});
}

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    let listing =await ListingModel.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        throw new ExpressError(404,"Page NOt Exist");
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.renderNewListingPage = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.addnewListing= async (req,res,next)=>{

    let listing1 = new ListingModel(req.body.listing);
    listing1.owner = req.user;
    await listing1.save();
    req.flash('success',"Listing Updated Successfully");
    res.redirect("/listings");
}

module.exports.renderEditListing = async(req,res,next)=>{
    let {id} = req.params;
let listing = await ListingModel.findById(id);
if(!listing){
    throw new ExpressError(404,"Page Not Exist !!")
}
res.render("listings/edit.ejs",{listing});
}

module.exports.editListing=async(req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","List Updated Successfully");
    res.redirect(`/listings/${id}/show`);
}

module.exports.deleteListings = async (req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    req.flash("success","list is Deleted Successfully");
    res.redirect("/listings");
};

module.exports.buyNowListing = async(req,res)=>{
    let {id} = req.params;
    let user = await User.findById(res.locals.currUser._id);
    let listing = await ListingModel.findById(id);
    user.orders.push(listing);
    user.save();
    req.flash("success","Item is added to cart")
    res.redirect(`/listings/${id}/show`)
}