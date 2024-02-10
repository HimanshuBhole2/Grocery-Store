const express = require('express');
const router = express.Router({mergeParams:true});


const ReviewModel = require("../models/review.js");
const ListingModel = require("../models/listing.js");
const {validateReview,isAuthor,isLoggedIn} = require("../middlewares.js");
const ReviewController = require("../controllers/review.js")
const wrapAsync = require("../utils/wrapAsync.js");

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(ReviewController.deleteReview))

router.post("/",isLoggedIn,validateReview ,ReviewController.addReview)


module.exports = router;