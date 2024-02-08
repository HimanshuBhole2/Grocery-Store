const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exp = require("constants");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const session = require("express-session");
const passport = require("passport")
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listings.js");
const userRouter = require("./routes/users.js");
const reviewRouter = require("./routes/reviews.js");
const isRedirectUrl = require("./middlewares.js")

const User = require("./models/user.js");


const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodeOverride("_method"));
app.engine("ejs",ejsMate)


PORT =8080;
// Session is set
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Change this to false if not using HTTPS
//   }))
app.use(flash());

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


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
app.use("/",userRouter);


// Home Route
app.get("/",(req,res)=>{
   
    res.send(`This is the Home Page`);
})

// error Middleware
app.use((err,req,res,next)=>{
    let{statusCode = 500,message="Error Not Found"} =err;
    res.status(statusCode).render("listings/error.ejs",{message});
})


app.listen(PORT,(req,res)=>{
    console.log(`Successfully Started http://localhost:${PORT}/listings`);
})