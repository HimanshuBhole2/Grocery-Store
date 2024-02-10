const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const ListingModel = require("../models/listing.js");
const {validateReview,validateListing,isRedirectUrl, isLoggedIn }= require("../middlewares.js");
const passport = require("passport")
const User = require("../models/user.js")

// const UserController = requrie("../controllers/users.js")
const UserController = require("../controllers/users.js");

router.route("/login")
    // Login render page
    .get(UserController.renderLoginForm)

    // Post login
    .post(isRedirectUrl, passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true})
    ,wrapAsync(UserController.Login))

router.route("/signIn")
    
    .get(UserController.renderSignIn)

    .post(wrapAsync(UserController.signIn))

router.get("/logOut",UserController.logOut)

router.get("/my-orders",isLoggedIn,wrapAsync(UserController.myOrders))

module.exports = router;