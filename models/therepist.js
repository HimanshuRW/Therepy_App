const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const therepistSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    msgs: [
        {
            from: { type: Schema.Types.ObjectId, ref: "Users" },
            msg: { type: String }
        }
    ]
});

module.exports = mongoose.model("Therepists", therepistSchema);