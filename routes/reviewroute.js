const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isReviewOwner, isLoggedIn } = require('../middleware.js')
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");

//Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.newReviewAdd));
//Reviews Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.destroyReview))

module.exports = router