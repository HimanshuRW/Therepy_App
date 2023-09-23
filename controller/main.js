const User = require("../models/user");
const Therepist = require("../models/therepist");

module.exports.get_checkup = (req, res, next) => {
    res.render("victim/QNA");
}
module.exports.get_vent = (req, res, next) => {
    res.render("victim/msgDropDown");
}
module.exports.get_index = (req, res, next) => {
    res.render("landing", {
        // productList: adminPage.items // array
    });
}