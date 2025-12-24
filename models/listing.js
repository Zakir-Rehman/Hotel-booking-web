const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
  },
  bedrooms: {
    type: String,
  },
  guests: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  image: {
    url: String,
    filename: String,
    
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }],
  owner:
  {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    latitude: String,
    longitude: String
  },
  category: {
    type: String,
    enum: ["Mountain", "srctic", "Farms", "Deserts", "Rooms", "Iconic Cities", "Amazing Pools", "Camping", "Cabins", "OMG"]
  }
});
// listingSchema.post("findOneAndDelete", async (listingss) => {
//   if (listingss) {

//     await review.deleteMany({ _id: { $in: listingss.reviews } })
//   }
// });
listingSchema.post("findOneAndDelete", async function (deletedListing) {
  if (!deletedListing) return; // ✅ agar null hai to seedha return kar do
  await review.deleteMany({ _id: { $in: deletedListing.reviews } });

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
// module.exports.listingSchema = listingSchema;