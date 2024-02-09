const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const ListingModel = require("../models/listing.js");
const {validateReview,validateListing,isRedirectUrl, isLoggedIn }= require("../middlewares.js");
const passport = require("passport")
const User = require("../models/user.js")


router.route("/login")
    // Login render page
    .get((req,res)=>{
        res.render("users/login.ejs");
    })

    // Post login
    .post(isRedirectUrl, passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true})
    ,wrapAsync( async (req,res)=>{
        req.flash("success","LogIn Successfully.");
        let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    }))

router.route("/signIn")
    
    .get((req,res)=>{
        res.render("users/signIn")
    })

    .post(wrapAsync(async(req,res)=>{
            let{username,email,password} = req.body;
            console.log(username, email, password);
            let user1 = new User({
                email:email,
                username:username
            })
            let registerdUser = await User.register(user1,password);
            req.login(registerdUser,(err)=>{
                if(err){
                    return(next(err))
                }
                else{
                    req.flash("success","Welcome to WonderLust. ");
                return  res.redirect("/listings")
                }
            })
    }))

router.get("/logOut",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Loggout successfully");
        return res.redirect("/listings");
    })
})

router.get("/my-orders",isLoggedIn,wrapAsync(async(req,res)=>{
    let user = await User.findById(res.locals.currUser._id).populate("orders");
    let orders = user.orders;
    res.render("users/orders.ejs",{orders})
    // res.send(orders);
}))

module.exports = router;