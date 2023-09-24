const User = require("../models/user");
const Therepist = require("../models/therepist");

module.exports.get_checkup = (req, res, next) => {
    res.render("victim/QNA");
}