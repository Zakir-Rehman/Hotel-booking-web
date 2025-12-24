const User = require("../models/user.js");

module.exports.profilePage = async (req, res) => {
    // Yahan current login user milega
    const user = req.user;
    // console.log('user is here : ', user)
    if (!user) {
        req.flash("error", "You must be logged in to view your profile");
        return res.redirect("/login");
    }

    // Profile page render karte waqt user ko pass karo
    return res.render("listings/profile.ejs", { user });
}
module.exports.signupPageRender = (req, res) => {
    res.render("users/signup")
}
module.exports.loginPageRender = (req, res) => {
    res.render("users/login")
}
module.exports.signup = async (req, res) => {

    let { username, email, mobile, day, month, year, gender, password } = req.body;
    // console.log('DETAIL IS HERE : ', username, email, mobile, day, month, year, gender, password)
    // bycrypt 
    // console.log(password)
    // bcrypt.genSalt(10, function (err, salt) {
    //     bcrypt.hash(password, salt, async function (err, hash) {
    //         let user = new User({
    //             username,
    //             email,
    //             password: hash
    //         });
    //         await user.save();

    //         console.log(user)
    //     })
    // })


    let newUser = new User({ username, email, mobile, day, month, year, gender });
    let registeredUser = await User.register(newUser, password);

    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) { return next(err) }
        req.flash('success', 'Welcome on Wonderlust!')
        res.redirect('/login')
    });


    // res.redirect('/listings')    
    //   let newUser =  await new User({
    //         email:email,
    //         username:username  
    //     })
    //     await User.register(newUser,`${password}`);

}
// module.exports.login = async (req, res) => {
//     req.flash('success', 'Welcome to Wanderlust! you are logged in. ');
//     if (res.locals.redirectUrl) {
//         return res.redirect(res.locals.redirectUrl)
//     }

//     res.redirect('/listings')
// }
// module.exports.login = async (req, res) => {
//     req.flash('success', 'Welcome to Wanderlust! you are logged in.');

//     const redirectUrl = res.locals.redirectUrl || '/listings';

//     delete req.session.redirectUrl;

//     res.redirect(redirectUrl);
// };
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome to Wanderlust! you are logged in.');
    if (res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl)
    }
    res.redirect('/listings')
}


module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err)
        }
        req.flash('success', 'Your are logged out')
        res.redirect('/listings')
    })
}