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
        // let therepist
        res.render("victim/index", {
            msgList: req.user.msgs.map(msg => {
                return { msg: msg.msg, from: msg.from.name, _id: msg._id, userId: msg.from._id }
            })
        });
    } else if (req.cookies.therepist) {
        res.render("therepist/index", {
            msgList: req.user.msgs.map(msg => {
                return { msg: msg.msg, from: msg.from.email, _id: msg._id, userId: msg.from._id }
            })
        });
    } else {
        res.render("landing");
    }
}
module.exports.get_experts = async (req, res, next) => {
    let therepists = await Therepist.find().select({ "password": 0 });
    console.log(therepists);
    res.render("victim/counsellers", {
        counsellerArr: therepists
    });
}
module.exports.get_talk_therepist = async (req, res, next) => {
    let therepistID = req.params.therepistID;
    res.render("victim/msgDropDown", {
        therepistId: therepistID,
        vent: false
    });
}
module.exports.post_talk_therepist = async (req, res, next) => {
    if (req.cookies.user) {
        let therepist = await Therepist.findById(req.body.therepistID);
        therepist.msgs.push({
            from: req.user._id,
            msg: req.body.msg
        });
        therepist.save()
            .then(() => {
                res.redirect("/");
            })
            .catch(err => console.log(err));
    } else {
        let user = await User.findById(req.body.therepistID);
        user.msgs.push({
            from: req.user._id,
            msg: req.body.msg
        });
        user.save()
            .then(() => {
                res.redirect("/");
            })
            .catch(err => console.log(err));
    }
}
module.exports.delete_msg = async (req, res, next) => {
    let msgId = req.params.id;
    let msgArr = req.user.msgs;
    msgArr = msgArr.filter(msgBody => {
        if (msgBody._id == msgId) {
            return false;
        }
        return true;
    });
    req.user.msgs = msgArr;
    req.user.save()
        .then(() => {
            res.redirect("/");
        })
        .catch(err => console.log(err));
}
module.exports.get_test = async (req, res, next) => {
    let msgId = req.params.id;
    let msgArr = req.user.msgs;
    msgArr = msgArr.filter(msgBody => {
        if (msgBody._id == msgId) {
            return false;
        }
        return true;
    });
    req.user.msgs = msgArr;
    req.user.save()
        .then(() => {
            res.redirect("/");
        })
        .catch(err => console.log(err));
}

module.exports.get_test1 = async (req, res, next) => {
    res.render("solutions/QNA1");
}
module.exports.post_test1 = async (req, res, next) => {
    let score = +req.body.q1+ +req.body.q2+ +req.body.q3;
    if (score > 10) {  // page 3 -> depression and bipolar disorder
        res.render("solutions/QNA3");
    } else {  //page -2 lonliness , anxiery
        res.render("solutions/QNA2");
    }
}
module.exports.post_test2 = async (req, res, next) => {
    let score = +req.body.q1+ +req.body.q2+ +req.body.q3;
    if (score < 11) {  // happy
        res.render("solutions/msg",{
            msg : "U r absolutely fine , keep enjoying the one life that u have somehow got !!!"
        });
    } else if (score< 15){  // lil anxiery
        res.render("solutions/msg",{
            msg : "U r having lil basic symtoms of anxiety but thats natrual, so its all fine !!!"
        });
    } else if (score< 17){  //  anxiery
        res.render("solutions/anxiety",{
            msg : "u r having some symtoms of Anxiety, but not to worry as its all curable...just do the following tasks"
        });
    } else {   // loneliness
        res.render("solutions/bipolar",{
            msg : "u r having some symtoms of Loneliness, but not to worry as its all curable...just do the following tasks"
        });
    }
}
module.exports.post_test3 = async (req, res, next) => {
    let score = +req.body.q1+ +req.body.q2+ +req.body.q3;
    if (score < 11) {  // u r not in depression , but u get sad sometimes and loose yr track , u rnot inrested in making frdns , feels good in his own company, 
        res.render("solutions/msg",{
            msg : "u r not in depression , but u get sad sometimes and loose yr track , u rnot inrested in making frdns , feels good in his own company"
        });
    } else if (score< 21){  // bi ploar
        res.render("solutions/bipolar",{
            msg : "u r having some symtoms of Bi-polar behaviour, but not to worry as its all curable...just do the following tasks"
        });
    } else {   // depression
        res.render("solutions/depression",{
            msg : "u r having some symtoms of depression, but not to worry as its all curable...just do the following tasks"
        });
    }
}
