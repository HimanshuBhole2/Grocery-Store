const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const ListingModel = require("../models/listing.js");
const User = require("../models/user.js");
const {validateReview,validateListing, isLoggedIn, isRedirectUrl, isOwner }= require("../middlewares.js");

const ListingController = require("../controllers/listings.js");
// const flash = require("connect-flash");

// Listing field

router.get("/",wrapAsync(ListingController.getListings))

// Show the grocery
router.get("/:id/show",wrapAsync(ListingController.showListing))


// Add New Listings
router.get("/new",isLoggedIn,wrapAsync(ListingController.renderNewListingPage))

router.post("/",isLoggedIn,validateListing,wrapAsync(ListingController.addnewListing))

// Edit The Route

router.get("/:id/edit",wrapAsync(ListingController.renderEditListing));

router.put("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.editListing))

// Delete the item 
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.deleteListings))

// BuyNow
router.post("/:id/buynow",isLoggedIn,wrapAsync(ListingController.buyNowListing))

// cancel Order
// ...


module.exports = router;