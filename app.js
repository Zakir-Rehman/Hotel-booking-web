require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require('ejs-mate');
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const listingsRouter = require("./routes/listings.js"); // router
const reviewRouter = require("./routes/reviewroute.js"); // router
const userRouter = require("./routes/user.js"); // router
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', engine);
// const wrapAsync = require("./utils/wrapAsync.js"); // ✅ sirf ek import rakha
app.use(express.static(path.join(__dirname, "public")))
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET
  },
  touchAfter: 24 * 3600
});
const sessionOption = {
  store,
  name: "zhhotel.sid", // session cookie name
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // ✅ IMPORTANT
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" // https only
  }
};
app.use(session(sessionOption));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// passport.use(new localStrategy(User.authenticate()))
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.delet = req.flash("delete")
  res.locals.currUser = req.user;
  next()
})
//two request detected to delete one 
const ongoingRequests = new Set();
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  const userId = req.user?.id || req.ip;
  const key = userId + req.originalUrl + req.method;
  if (ongoingRequests.has(key)) {
    return res.status(429).json({
      message: "Request already processing"
    });
  }
  ongoingRequests.add(key);
  res.on("finish", () => {
    ongoingRequests.delete(key);
  });
  next();
});
//Routes - router
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  console.log("______ERROR________", err);
  res.status(status).render("listings/errorHandler", {
    message,
    status,
    error: err.name || "Server Error"
  });
});
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("server is listening to port ", PORT);
  // console.log(`Server running on http://0.0.0.0:${PORT}`);
});

