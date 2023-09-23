const User = require("../models/user");
const Therepist = require("../models/therepist");

module.exports.auth =  async (req,res,next)=>{
    if(req.cookies.logged){
        if (req.cookies.user) {
            req.user = await User.findById(req.user);
            next();
        } else {
            req.user = await Therepist.findById(req.user);
            next();
        }
    } else {
        res.redirect("/");
    }
}