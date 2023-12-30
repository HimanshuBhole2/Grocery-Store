const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exp = require("constants");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ListingModel = require("./models/listing");
const ExpressError = require("./util/expressError");
const wrapAsync = require("./util/wrapAsync");



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

// Listing field

app.get("/listings",async (req,res)=>{
    let listings = await ListingModel.find({});
    res.render("listings/index.ejs",{listings});
})

// Show the grocery
app.get("/listings/:id/show",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing =await ListingModel.findById(id);
    if(!listing){
        throw new ExpressError(404,"Page NOt Exist");
    }
    res.render("listings/show.ejs",{listing})
}))


// Add New Listings
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",wrapAsync(async (req,res,next)=>{

    let listing1 = new ListingModel(req.body.listing)
    await listing1.save();
    res.redirect("/listings");
}))

// Edit The Route

app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if(!listing){
        throw new ExpressError(404,"Page Not Exist !!")
    }
    res.render("listings/edit.ejs",{listing});
}))

app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}/show`);
}))

// Delete the item 
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    res.redirect("/listings");
}))

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