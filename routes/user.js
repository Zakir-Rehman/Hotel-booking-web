const express = require("express");
const router = express.Router();
// const bcrypt = require('bcrypt')
const passport = require('passport')
const wrapAsync = require('../utils/wrapAsync.js')
const { saveRedirectUrl } = require('../middleware.js')
const { isLoggedIn } = require('../middleware.js');
const userController = require('../controllers/users.js');
router.get("/profile", isLoggedIn, userController.profilePage);
router.route('/signup')
    .get(userController.signupPageRender)
    .post(wrapAsync(userController.signup))
//   let fakeUser = new User({
//     email:'zakirmala099@gamil.com',
//     username:'zakirrehman'
//   })
//   let regUser = await User.register(fakeUser,'zakirmala1');
//   res.send(regUser)
// })
// router.post("/signup", wrapAsync(async (req, res) => {
//     let { username, email, password } = req.body;
//     let newUser = new User({ email, username });
//     let registeredUser = await User.register(newUser, password);
//     req.flash('success', 'User was registered successfully');
//     res.redirect("/login");
// }));
router.route("/login")
    .get(userController.loginPageRender)
    .post(saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login);
// router.post("/login", async (req, res) => {
//     let { email, password } = req.body;
//     let user = await User.findOne({ email: email })
//     if (!user) {
//         console.log("Not Found");
//         res.send("Not Found")
//     }
//     else {
//         // bcrypt.compare(password, user.password, async (err, result) => {
//         //     if (err) { return res.send(err) }
//         //     else {
//         //         if (result) {
//         //             res.redirect("/listings")
//         //         } else {
//         //             console.log("Something went wrong")
//         //             res.send("Something went wrong")
//         //         }

//         //     }
//         // })

//     }

// })
router.get("/logout", userController.logout)
module.exports = router