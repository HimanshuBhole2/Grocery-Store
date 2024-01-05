const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exp = require("constants");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ListingModel = require("./models/listing");
const ReviewModel = require("./models/review.js")
const ExpressError = require("./utils/expressError.js");
const listingRouter = require("./routes/listings.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema} =require("./schema.js");
const Joi = require("joi")


const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodeOverride("_method"));
app.engine("ejs",ejsMate)

main().then(()=>{
    console.log("Mongo Connection establised");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shopgrocery');
}



app.use("/listings",listingRouter)


const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}



// Add Review
app.delete("/listings/:id/review/:reviewId",async(req,res)=>{
    let{id,reviewId}= req.params;
    await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}/show`);

})


app.post("/listings/:id/review",validateReview ,async(req,res)=>{
    let {id} = req.params;
   let review1 = new ReviewModel(req.body.review);
   await review1.save();
   let listing1 =await ListingModel.findById(id).populate("reviews");
    listing1.reviews.push(review1);
    await listing1.save();
    console.log(listing1.reviews[0]);
    
   return res.redirect(`/listings/${listing1._id}/show`);
})


// Home Route
app.get("/",(req,res)=>{
   
    res.send(`This is the Home Page`);
})

// error Middleware

app.use((err,req,res,next)=>{
    let{statusCode = 500,message="Error Not Found"} =err;
    res.status(statusCode).render("listings/error.ejs",{message});

})

app.listen(8000,(req,res)=>{
    console.log("The Local Host Server staredt at the Port 8000");
})