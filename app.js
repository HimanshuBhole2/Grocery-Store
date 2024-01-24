const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exp = require("constants");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");

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


// All Routers site
app.use("/listings",listingRouter)
app.use("/listings/:id/review",reviewRouter);

// const {validateReview} = require("./middlewares.js");



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