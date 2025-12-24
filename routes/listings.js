/////////////////routes  
// const express = require("express");
// const router = express.Router();

// const { Listingschema } = require("../schema.js");
// const wrapAsync = require("../utils/wrapAsync.js"); // ✅ sirf ek import rakha
// const ExpressError = require("../utils/expressError.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review");

// ///validate errors
// const validateListing = (req, res, next) => {
//   let { error } = Listingschema.validate(req.body)
//   if (error) {
//     console.log(error)
//     let errMsg = error.details.map((e) => e.message).join(",")
//     throw new ExpressError(400, errMsg)
//   }
//   else {
//     next()
//   }
// }

// //Index Route
// router.get("/", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya (GET pe body nahi hoti)
//   const allListings = await Listing.find({});
//   res.render("listings/index", { allListings });
//   // console.log(allListings)
// }));

// //New Route
// router.get("/new", (req, res) => {  // ✅ validateListing hata diya
//   res.render("listings/new.ejs");
// });

// //Show Route
// router.get("/:id", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   const listingCount = await Review.countDocuments()
//   console.log(listingCount)
//   if(!listing){
//     req.flash("error","Listing you request does not exist")
//     res.redirect("/listings")
//   }
//   res.render("listings/show.ejs", { listing ,listingCount});
// }));
// //Create Route
// router.post("/", validateListing, wrapAsync(async (req, res, next) => {
//   const newListing = new Listing(req.body.listing); // ✅ await new Listing() → sirf new Listing()
//   await newListing.save();
//   req.flash("success", "New Listing Created")
//   res.redirect("/listings");
// }));
// //Edit Route
// router.get("/:id/edit", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya
//   let { id } = req.params;
//   const listing = await Listing.findById(id);

//   res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// router.put("/:id", validateListing, wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success", "Listing Edited")
//   res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// router.delete("/:id", wrapAsync(async (req, res) => {  // ✅ validateListing hata diya
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   req.flash("delete", "Listing Deleted")
//   res.redirect("/listings");
// }));
// module.exports = router


console.log("LISTINGS ROUTER LOADED");
///////////////// routes/listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

// const Listing = require("../models/listing.js");
// const Review = require("../models/review");
// const User = require("../models/user.js");
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')

const listingController = require('../controllers/listings.js')
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })
// Index Route - show all listings
router.route("/")
  .get(wrapAsync(listingController.index))
  // Create Route - add new listing
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createNewListing))
// .post(upload.single('listing[image]'), (req, res) => {
//   res.send(req.file)
// })

router.post("/search", listingController.searchPageRender);
// New Route - show form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/deals", listingController.deals);
router.get("/profile/:id", listingController.profileFind);
router.get('/liked/:id', isLoggedIn, listingController.makeFovourite);
// Delete Favorite or Listing
router.get('/disliked/:id', isLoggedIn, listingController.destroyFavourite);


// Favourite Route -
router.get('/favorite', isLoggedIn, listingController.favouritePageRender);
router.get('/about', listingController.aboutUs)
router.post('/uploaded',isLoggedIn, listingController.uploadImage)
// Show Route - show one listing
router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  // Update Route - update listing
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  // Delete Route - delete listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route - show form to edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));




module.exports = router;
