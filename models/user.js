const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sufferingPool: {
        type: String,
    },
    msgs: [
        {
            from: { type: Schema.Types.ObjectId, ref: "Therepists" },
            msg: { type: String }
        }
    ]
});

module.exports = mongoose.model("Users", userSchema);