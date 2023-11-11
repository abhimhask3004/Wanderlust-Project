const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../init/utils/wrapasyc.js");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const reviews = require("../models/reviews.js");
const {validatereview,islogedin,isReviewAuthor}=require("../views/midleware/midleware.js");
const controllersReview=require("../controllers/review.js");

// REviews
//post review route

router.post("/",validatereview,islogedin,wrapAsync(controllersReview.createReview))

 //Delete review route
router.delete("/:reviewID",islogedin,isReviewAuthor,wrapAsync(controllersReview.destroyReviws))

module.exports=router;