const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    issue: {
        type: String
    },
    msgs: []
});



module.exports = mongoose.model("Chats", chatSchema);