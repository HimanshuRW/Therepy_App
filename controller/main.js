const User = require("../models/user");
const Therepist = require("../models/therepist");

module.exports.get_checkup = (req, res, next) => {
    res.render("victim/QNA");
}
module.exports.get_vent = (req, res, next) => {
    res.render("victim/msgDropDown");
}
module.exports.get_index = (req, res, next) => {
    // console.log(req.cookies);
    if (req.cookies.user) {
        res.render("victim/index");
    } else if (req.cookies.therepist){
        res.render("therepist/index");
    } else {
        res.render("landing");
    }
}