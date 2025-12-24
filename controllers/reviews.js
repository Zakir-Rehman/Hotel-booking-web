const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// module.exports.newReviewAdd = async (req, res, next) => {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     const newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("New Review Saved:", newReview);
//     req.flash("success", "Comment sent");
//     return res.redirect(`/listings/${listing._id}`); // ✅ return lagao
// };
module.exports.newReviewAdd = async (req, res) => {
    try {

        const listing = await Listing.findById(req.params.id);

        //  naya review banao
        const review = new Review(req.body.review);

        //  logged-in user ko author banao
        review.author = req.user._id;

        //  review aur listing dono save karo
        await review.save();
        listing.reviews.push(review);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).render("listings/errorHandler.ejs", {
            error: err,
            message: "Internal Server Error",
            status: 500
        });
    }
};
module.exports.destroyReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;

        const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        if (!listing) {
            console.log("Listing not found");
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            console.log("Review not found");
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        console.log("Deleted listing:", listing);
        console.log("Deleted review:", review);

        req.flash("success", "Comment Deleted");
        res.redirect(`/listings/${id}`);
        // } catch (err) {
        //     console.error("Error deleting review:", err);
        //     req.flash("error", "Something went wrong");
        //     res.redirect("/listings");
        // }
    } catch (err) {
        console.error(err);
        res.status(500).render("listings/errorHandler.ejs", {
            error: err,
            message: "Internal Server Error",
            status: 500
        });
    }
};
