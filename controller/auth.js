const User = require("../models/user");
const Therepist = require("../models/therepist");
const bcrypt = require("bcryptjs");
const axios = require('axios');

module.exports.get_therepist_register = (req, res, next) => {
    res.render("auth/therepistRegister", {
        msg: ""
    });
}
module.exports.post_therepist_register = (req, res, next) => {
    Therepist.findOne({ email: req.body.email })
        .then(async user => {
            if (user == null) {
                if (req.body.pass == req.body.confpass) {
                    const otp = Math.floor(1000 + Math.random() * 9000);
                    req.body.otp = otp;
                    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=Fyd2YXghDJznir8tGCjKf5aT0skNSQ3b6AMZEe9U7mlVWxRBPw7BLQTYprtGHUe3XxVJ0hR5kSvniKqP&route=otp&variables_values=${otp}&flash=0&numbers=${req.body.tel}`;
                    let response = await axios.get(url);
                    // console.log(response.data);
                    res.cookie("otp", JSON.stringify(req.body));
                    res.redirect("/otp");
                } else {
                    res.render("auth/therepistRegister", {
                        msg: "Password and Comfirm Password are not same"
                    });
                }
            } else {
                res.render("auth/therepistRegister", {
                    msg: "This mail already exists"
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}
module.exports.get_user_register = (req, res, next) => {
    res.render("auth/registerUser", {
        msg: ""
    });
}
module.exports.get_otp = (req, res, next) => {
    if (req.cookies.otp) {
        res.render("auth/otp", {
            msg: ""
        });
    } else res.redirect("auth/therepistRegister");
}
module.exports.post_otp = (req, res, next) => {
    // ----- after verification of otp ----
    let myUser = JSON.parse(req.cookies.otp);
    if (req.body.otpFilled == myUser.otp) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(myUser.pass, salt, async function (err, hashedPassword) {
                const newUser = new Therepist({
                    email: myUser.email,
                    password: hashedPassword,
                    msgs: [],
                    city: myUser.city,
                    phone: myUser.tel,
                    name: myUser.name,
                })
                let user = await newUser.save();
                res.cookie("logged", true);
                res.cookie("therepist", user._id);
                res.clearCookie('user');
                req.user = user;
                res.redirect("/");
            });
        });
    } else {
        res.render("auth/otp", {
            msg: "OTP is wrong"
        });
    }
}
module.exports.post_user_register = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user == null) {
                if (req.body.pass == req.body.confpass) {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(req.body.pass, salt, async function (err, hashedPassword) {
                            const newUser = new User({
                                email: req.body.email,
                                password: hashedPassword,
                                msgs: []
                            })
                            let user = await newUser.save();
                            res.cookie("logged", true);
                            res.cookie("user", user._id);
                            res.clearCookie('therepist');
                            req.user = user;
                            res.redirect("/");
                        });
                    });
                } else {
                    res.render("auth/registerUser", {
                        msg: "Password and Comfirm Password are not same"
                    });
                }
            } else {
                res.render("auth/registerUser", {
                    msg: "This mail already exists"
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}
module.exports.get_login = (req, res, next) => {
    res.render("auth/login", {
        msg: ""
    });
}
module.exports.post_login = (req, res, next) => {
    if (req.body.type == "victim") {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user == null) {
                    res.render("auth/login", {
                        msg: "Wrong Emial or password"
                    });
                } else {
                    bcrypt.compare(req.body.pass, user.password, async (err, result) => {
                        if (result) {
                            // ----- right Credentials ----
                            res.cookie("logged", true);
                            res.cookie("user", user._id);
                            res.clearCookie('therepist');
                            req.user = user;
                            res.redirect("/");
                        } else {
                            // ---- wrong password ---
                            res.render("auth/login", {
                                msg: "Wrong Emial or password"
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        Therepist.findOne({ email: req.body.email })
            .then(user => {
                if (user == null) {
                    res.render("auth/login", {
                        msg: "Wrong Emial or password"
                    });
                } else {
                    console.log("come in block");
                    bcrypt.compare(req.body.pass, user.password, async (err, result) => {
                        if (result) {
                            // ----- right Credentials ----
                            console.log("write password");
                            res.cookie("logged", true);
                            res.cookie("therepist", user._id);
                            res.clearCookie('user');
                            console.log("----------");
                            req.user = user;
                            res.redirect("/");
                        } else {
                            // ---- wrong password ---
                            console.log("wrong Passwrord");
                            res.render("auth/login", {
                                msg: "Wrong Emial or password"
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}
module.exports.get_logout = (req, res, next) => {
    res.clearCookie('user');
    res.clearCookie('therepist');
    res.clearCookie('logged');
    res.redirect("/");
}