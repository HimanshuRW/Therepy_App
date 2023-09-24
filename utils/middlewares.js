const User = require("../models/user");
const Therepist = require("../models/therepist");

module.exports.auth = async (req, res, next) => {
    if (req.cookies.logged) {
        console.log("logged");
        if (req.cookies.user) {
            console.log("victim hai");
            req.user = await User.findById(req.cookies.user).populate({
                path: 'msgs',
                populate: {
                    path: 'from',
                    model: 'Therepists'
                }
            });
            next();
        } else {
            console.log("therepist hai");
            req.user = await Therepist.findById(req.cookies.therepist).populate({
                path: 'msgs',
                populate: {
                    path: 'from',
                    model: 'Users'
                }
            });

            next();
        }
    } else {
        console.log("not logged in ");
        res.render("landing");
    }
}