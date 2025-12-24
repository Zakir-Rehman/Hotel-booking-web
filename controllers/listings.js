const Favourite = require('../models/favourite.js');
const Listing = require('../models/listing')
const Review = require('../models/review')
const User = require("../models/user.js");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
 return res.render("listings/index.ejs", { allListings });

}
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' }
    })
    // .populate('reviews')
    .populate('owner');
  const listingCount = await Review.countDocuments();
  // console.log(listing)

  if (!listing) {
    req.flash("error", "Listing you request does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing, listingCount });
}
// module.exports.createNewListing = async (req, res) => {
//   let { country, location } = req.body.listing
//   let count = country.toLowerCase()
//   let loc = location.trim().replace(/\s+/g, "+");
//   const API_fetch = await fetch(`https://nominatim.openstreetmap.org/search?q=${loc}+${count}&format=json`)
//   const resp = await API_fetch.json()
//   let latitude = resp[0].lat;
//   let longitude = resp[0].lon
//   let url = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename }
//   newListing.geometry = { latitude, longitude }
//   await newListing.save();
//   console.log(newListing)
//   req.flash("success", "New Listing Created");
//   res.redirect("/listings");
// }

module.exports.createNewListing = async (req, res) => {
  try {
    let { country, location } = req.body.listing;
    let count = country.toLowerCase();
    let loc = location.trim().replace(/\s+/g, "+");

    const API_fetch = await fetch(`https://nominatim.openstreetmap.org/search?q=${loc}+${count}&format=json`);
    const resp = await API_fetch.json();

    if (!resp || resp.length === 0) {
      req.flash("error", "Location not found!");
      return res.redirect("/listings/new");
    }

    let latitude = resp[0].lat;
    let longitude = resp[0].lon;
    // let url = req.file.path;
    // let filename = req.file.filename;
    let url, filename;
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    } else {
      url = "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=2000"; // fallback image
      filename = "default.jpg";
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = { latitude, longitude };

    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");

  } catch (err) {
    console.error(err);
    res.status(500).render("listings/errorHandler.ejs", {
      error: err,
      message: "Internal Server Error",
      status: 500
    });
  }
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect('/listings')
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/e_blur:200,")
  res.render("listings/edit.ejs", { listing, originalImageUrl });
}
module.exports.updateListing = async (req, res) => {
  // let listing = await Listing.findById(id)
  // if(!listing.owner.equals(res.locals.currUser._id) ){
  //   req.flash("error","You dont have permission to edit listing ")
  //  return  res.redirect(`/listings/${id}`);
  // }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename }
    await listing.save()
  }
  req.flash("success", "Listing Edited");
  res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("delete", "Listing Deleted");
  res.redirect("/listings");
}
// first code for make fav
// module.exports.makeFovourite = async (req, res) => {
//   try {
//     let { id } = req.params;
//     let findlisting = await Listing.findById(id);
//     if (!findlisting) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//     }
//     console.log(findlisting.image,findlisting.title,findlisting.price)
//     // let savedItem = await Favourite.create(findlisting)
//     // console.log(savedItem)
//     // return res.send(savedItem)
//     return res.send(findlisting)
//     // req.flash("success", "Added to favourites!");
//     // return res.redirect("/listings");
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("listings/errorHandler.ejs", {
//       error: err,
//       message: "Internal Server Error",
//       status: 500
//     });
//   }
// };
// second code for make fav
// module.exports.makeFovourite = async (req, res) => {
//   try {
//     let { id } = req.params;

//     // 1️⃣ Listing database me dhondho
//     let findListing = await Listing.findById(id);
//     if (!findListing) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//     }
//     if (findListing) {
//       await Favourite.find({ title: findListing.title })
//       return res.redirect('')
//     }
//     // 2️⃣ Favourite document banao Listing ke data se
//     const favouriteData = {
//       title: findListing.title,
//       image: findListing.image,
//       price: findListing.price,
//     };

//     // 3️⃣ Favourite me save karo
//     const savedFav = await Favourite.create(favouriteData);

//     console.log("Added to Favourite:", savedFav);
//     req.flash("success", "Added to favourites!");
//     res.redirect("/listings");

//   } catch (err) {
//     console.error(err);
//     res.status(500).render("listings/errorHandler.ejs", {
//       error: err,
//       message: "Internal Server Error",
//       status: 500
//     });
//   }
// };

// final code without user 
// module.exports.makeFovourite = async (req, res) => {
//   try {
//     let { id } = req.params;

//     // 1️⃣ Listing database me dhondho
//     let findListing = await Listing.findById(id);
//     if (!findListing) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//     }

//     // 2️⃣ Pehle check karo ke wo favourite me pehle se maujood hai ya nahi
//     let existingFav = await Favourite.findOne({ title: findListing.title });
//     if (existingFav) {
//       req.flash("error", "This listing is already favourited!");
//       return res.redirect("/listings");
//     }

//     // 3️⃣ Favourite document banao
//     const favouriteData = {
//       title: findListing.title,
//       image: findListing.image,
//       price: findListing.price,
//     };

//     // 4️⃣ Favourite me save karo
//     const savedFav = await Favourite.create(favouriteData);

//     console.log("Added to Favourite:", savedFav);
//     req.flash("success", "Added to favourites!");
//     res.redirect("/listings");

//   } catch (err) {
//     console.error(err);
//     res.status(500).render("listings/errorHandler.ejs", {
//       error: err,
//       message: "Internal Server Error",
//       status: 500
//     });
//   }
// };


module.exports.makeFovourite = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Listing database me dhondho
    const findListing = await Listing.findById(id);
    if (!findListing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let user = req.user
    // 2️⃣ Current logged-in user
    console.log("user start form here")
    console.log(req.user)
    console.log("user end on here")
    if (!user) {
      req.flash("error", "Please login to add favourites.");
      return res.redirect("/login");
    }

    // 3️⃣ Check karo ke ye listing pehle se user ke favourites me hai ya nahi
    if (user.favourites.includes(findListing._id)) {
      req.flash("error", "This listing is already favourited!");
      return res.redirect("/listings");
    }

    // 4️⃣ Agar favourite nahi hai to add karo
    user.favourites.push(findListing._id);
    await user.save();

    req.flash("success", "Added to favourites!");
    res.redirect("/listings");

  } catch (err) {
    console.error("❌ Error adding favourite:", err);
    res.status(500).render("listings/errorHandler.ejs", {
      error: err,
      message: "Internal Server Error",
      status: 500
    });
  }
};



// module.exports.destroyFavourite = async (req, res) => {
//   try {
//     let { id } = req.params;
//     let deleted = await Favourite.deleteOne({ _id: id });
//     console.log(deleted)
//     req.flash("success", "Removed from favourites!");
//     return res.redirect("/listings/favorite");
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("listings/errorHandler.ejs", {
//       error: err,
//       message: "Internal Server Error",
//       status: 500
//     });
//   }


// };


// module.exports.favouritePageRender = async (req, res) => {
//   try {
//     const liked = await Favourite.find({});
//     const likedCount = liked.length;

//     res.render('listings/favorite.ejs', { listings: liked, likedCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("listings/errorHandler.ejs", {
//       error: err,
//       message: "Internal Server Error",
//       status: 500
//     });
//   }
// };
// module.exports.favouritePageRender = async (req, res) => {
//   try {
//     let listings = await Favourite.find({});
//     let likedCount = listings.length;
//     res.render("listings/favorite.ejs", { listings, likedCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("listings/errorHandler.ejs", {
//       error: err,
//       message: "Internal Server Error",
//       status: 500
//     })
//   }
// }// 👈 yeh closing bracket aur semicolon zaroor ho

module.exports.destroyFavourite = async (req, res) => {
  try {
    const { id } = req.params; // wo ObjectId jo user ke favourites me hai

    // User document ke favourites array se remove karna
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favourites: id } // $pull array se id remove kar deta hai
    });

    req.flash("success", "Removed from favourites!");
    return res.redirect("/listings/favorite");
  } catch (err) {
    console.error(err);
    res.status(500).render("listings/errorHandler.ejs", {
      error: err,
      message: "Internal Server Error",
      status: 500
    });
  }
};

module.exports.favouritePageRender = async (req, res) => {
  try {
    const user = req.user; // current logged-in user
    if (!user) {
      req.flash("error", "Please login to see your favourites.");
      return res.redirect("/login");
    }

    // 1️⃣ Populate user ke favourites (Listing details)
    await user.populate("favourites"); // populate ObjectId references

    const listings = user.favourites; // ab yeh sirf current user ke favourites hain
    const likedCount = listings.length;

    res.render("listings/favorite.ejs", { listings, likedCount });

  } catch (err) {
    console.error("❌ Error loading favourites:", err);
    res.status(500).render("listings/errorHandler.ejs", {
      error: err,
      message: "Internal Server Error",
      status: 500
    });
  }
};


module.exports.deals = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/deals.ejs", { allListings });

}
module.exports.profileFind = async (req, res) => {
  let { id } = req.params;
  // console.log(id)
  let listings = await User.findById(id);
  console.log(listings)
  res.render('listings/profile.ejs', { listings })
}
module.exports.searchPageRender = async (req, res) => {
  try {
    const { search } = req.body;
    const allListings = await Listing.find({ country: search });

    // if (!allListings || allListings.length === 0) {

    //   req.flash("error", "Location Not Found ");
    //   return res.redirect("/listings");
    // }
    console.log(allListings);
    res.render("listings/searched.ejs", { allListings });

  } catch (err) {
    console.error(err);
    res.status(500).render("listings/errorHandler.ejs", {
      error: err,
      message: "Internal Server Error",
      status: 500
    });
  }
};
module.exports.aboutUs = (req, res) => {
  res.render("listings/about.ejs")
}
module.exports.uploadImage = (req, res) => {
  res.send('done')
}