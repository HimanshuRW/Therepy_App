const User = require("../models/user");
const Therepist = require("../models/therepist");
const Chats = require("../models/chats");
const axios = require('axios');

module.exports.get_checkup = (req, res, next) => {
    res.render("victim/QNA");
}
module.exports.get_vent = (req, res, next) => {
    res.render("victim/msgDropDown", {
        vent: true,
        therepistId: ""
    });
}
module.exports.post_vent = async (req, res, next) => {
    try {
        let resp = await axios.post("https://api.apilayer.com/text_to_emotion",
            // req.body.msg,
            "i am scared of going in dark due to horror movie today",
            {
                redirect: 'follow',
                headers: { 'apikey': 'Ayz4jKxUi1bYrb33EUW1j8VoH359lTHP' }
            });
        console.log(resp.data);
        let dominanteEmotion ="";
        let lowest =0;
        for (emotion in resp.data){
            if (resp.data[emotion]>lowest) {
                lowest = resp.data[emotion];
                dominanteEmotion = emotion;
            }
        }
        let msg = "";
        if (dominanteEmotion=="Happy") {
            msg = `Well, seems like You had a good day... may be u continue with great one !!!`;
        } else if (dominanteEmotion=="Angry") {
            msg = `Seems like u dont have the best day, but its ok, life is like that , u better not ruin yr mental peace`;
        } else if (dominanteEmotion=="Surprise") {
            msg = `Seems like u got to have somenting new today, anyways life is all abt unexpected suprise ....`;
        } else if (dominanteEmotion=="Sad") {
            msg = `u know , its all okay to not be happy all the time, bcz we humans r natually like that, so just feel yr emotions lightly, and its all okay`;
        } else if (dominanteEmotion=="Fear") {
            msg = `seems lik something inside u not leeting do do what u really want... its ok , just let yr inner self out`;
        } else {
            msg = `Nothing much to concluded..`;
        }
        res.render("victim/msg",{
            msg : msg
        })
    } catch (error) {
        console.error(error);
    }
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
    let score = +req.body.q1 + +req.body.q2 + +req.body.q3;
    if (score > 10) {  // page 3 -> depression and bipolar disorder
        res.render("solutions/QNA3");
    } else {  //page -2 lonliness , anxiery
        res.render("solutions/QNA2");
    }
}
module.exports.post_test2 = async (req, res, next) => {
    let score = +req.body.q1 + +req.body.q2 + +req.body.q3;
    if (score < 11) {  // happy
        res.render("solutions/msg", {
            msg: "U r absolutely fine , keep enjoying the one life that u have somehow got !!!"
        });
    } else if (score < 15) {  // lil anxiery
        res.render("solutions/msg", {
            msg: "U r having lil basic symtoms of anxiety but thats natrual, so its all fine !!!"
        });
    } else if (score < 17) {  //  anxiery
        res.render("solutions/anxiety", {
            msg: "u r having some symtoms of Anxiety, but not to worry as its all curable...just do the following tasks"
        });
    } else {   // loneliness
        res.render("solutions/bipolar", {
            msg: "u r having some symtoms of Loneliness, but not to worry as its all curable...just do the following tasks"
        });
    }
}
module.exports.post_test3 = async (req, res, next) => {
    let score = +req.body.q1 + +req.body.q2 + +req.body.q3;
    if (score < 11) {  // u r not in depression , but u get sad sometimes and loose yr track , u rnot inrested in making frdns , feels good in his own company, 
        res.render("solutions/msg", {
            msg: "u r not in depression , but u get sad sometimes and loose yr track , u rnot inrested in making frdns , feels good in his own company"
        });
    } else if (score < 21) {  // bi ploar
        res.render("solutions/bipolar", {
            msg: "u r having some symtoms of Bi-polar behaviour, but not to worry as its all curable...just do the following tasks"
        });
    } else {   // depression
        res.render("solutions/depression", {
            msg: "u r having some symtoms of depression, but not to worry as its all curable...just do the following tasks"
        });
    }
}
module.exports.join = async (req, res, next) => {
    let issue = req.params.issue;
    let doc = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { sufferingPool: "issue" } });
    res.redirect("/chat");
}
module.exports.get_chat = async (req, res, next) => {
    if (req.user.sufferingPool) {
        let arr;
        let issue;
        if (req.user.sufferingPool == "anxiety") {
            issue = "anxiety";
        } else if (req.user.sufferingPool == "depression") {
            issue = "depression";
        } else if (req.user.sufferingPool == "bipolar") {
            issue = "bipolar";
        } else {
            issue = "loneliness";
        }
        let obj = await Chats.findOne({ issue: issue });
        res.render("solutions/chat", {
            msgs: obj.msgs,
            issue: issue
        })
    } else res.redirect("/test");
}
module.exports.post_chat = async (req, res, next) => {
    let arr;
    let issue;
    if (req.user.sufferingPool == "anxiety") {
        issue = "anxiety";
    } else if (req.user.sufferingPool == "depression") {
        issue = "depression";
    } else if (req.user.sufferingPool == "bipolar") {
        issue = "bipolar";
    } else {
        issue = "loneliness";
    }
    let obj = await Chats.findOne({ issue: issue });
    obj.msgs.push(req.body.day);
    await obj.save();
    obj = await Chats.findOne({ issue: issue });
    res.render("solutions/chat", {
        msgs: obj.msgs,
        issue: req.user.sufferingPool
    })
}
