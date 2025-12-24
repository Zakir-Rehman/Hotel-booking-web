const Listing = require("./models/listing")
const Review = require('./models/review.js')
const { Listingschema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/expressError.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        // Agar POST request hai (review submit), to GET wali page save karo
        if (req.method === "POST") {
            const redirectTo = req.originalUrl.split("/reviews")[0]; 
            req.session.redirectUrl = redirectTo;
        } else {
            req.session.redirectUrl = req.originalUrl;
        }

        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }


    next();
};
module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params; // listingId aur reviewId dono usually route me hote hain
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // ownership check
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
/// Validate errors middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = Listingschema.validate(req.body);
    if (error) {
        console.log(error);
        let errMsg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        let errMsg = error.details.map((e) => e.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}